import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";

/**
 * GitHub repository allowed to assume the deploy role, and the branch
 * that's allowed to trigger a deploy. Update these if the repo is
 * ever renamed/transferred.
 */
const GITHUB_OWNER = "willianpdon";
const GITHUB_REPO = "william-nascimento-portfolio";
const GITHUB_DEPLOY_BRANCH = "main";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---------------------------------------------------------------
    // S3 bucket — private, holds the Vite build output (dist/).
    // Only CloudFront (via Origin Access Control) can read from it.
    // ---------------------------------------------------------------
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // The bucket only ever holds a rebuildable static build artifact,
      // so it's safe to destroy along with its contents when the stack
      // is torn down — there's no user data to lose.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ---------------------------------------------------------------
    // Security headers applied to every response served by CloudFront.
    // ---------------------------------------------------------------
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "SecurityHeadersPolicy",
      {
        comment: "Baseline security headers for the portfolio site",
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.days(365),
            includeSubdomains: true,
            preload: true,
            override: true,
          },
          contentSecurityPolicy: {
            contentSecurityPolicy: [
              "default-src 'self'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "script-src 'self'",
              "img-src 'self' data:",
              "connect-src 'self'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
            override: true,
          },
        },
      },
    );

    // ---------------------------------------------------------------
    // CloudFront distribution — Origin Access Control keeps the S3
    // bucket private. 403/404 fall back to index.html so client-side
    // routing (added in a later phase) won't break on refresh.
    // PRICE_CLASS_100 covers North America + Europe, which matches
    // where William is targeting roles, at the lowest CloudFront tier.
    // ---------------------------------------------------------------
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultRootObject: "index.html",
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // ---------------------------------------------------------------
    // GitHub Actions OIDC — lets the deploy workflow assume an IAM
    // role using a short-lived token instead of long-lived access
    // keys. Trust is scoped to this exact repo and branch.
    // ---------------------------------------------------------------
    const githubOidcProvider = new iam.OpenIdConnectProvider(this, "GithubOidcProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    const deployRole = new iam.Role(this, "GithubActionsDeployRole", {
      roleName: "portfolio-github-actions-deploy",
      description: "Assumed by GitHub Actions (OIDC) to deploy the portfolio site to S3/CloudFront.",
      assumedBy: new iam.WebIdentityPrincipal(githubOidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        },
        StringLike: {
          "token.actions.githubusercontent.com:sub": `repo:${GITHUB_OWNER}/${GITHUB_REPO}:ref:refs/heads/${GITHUB_DEPLOY_BRANCH}`,
        },
      }),
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Least privilege: only what `aws s3 sync --delete` and a
    // CloudFront invalidation actually need.
    siteBucket.grantReadWrite(deployRole);
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [
          `arn:aws:cloudfront::${cdk.Stack.of(this).account}:distribution/${distribution.distributionId}`,
        ],
      }),
    );

    // ---------------------------------------------------------------
    // Outputs — feed these into the GitHub repo's Actions variables
    // (see infra/README.md) and use the site URL to preview the
    // live deployment.
    // ---------------------------------------------------------------
    new cdk.CfnOutput(this, "SiteBucketName", { value: siteBucket.bucketName });
    new cdk.CfnOutput(this, "DistributionId", { value: distribution.distributionId });
    new cdk.CfnOutput(this, "SiteUrl", { value: `https://${distribution.distributionDomainName}` });
    new cdk.CfnOutput(this, "GithubActionsDeployRoleArn", { value: deployRole.roleArn });
  }
}
