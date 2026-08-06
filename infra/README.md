# Infrastructure — AWS CDK

Provisions the static hosting for the portfolio: a private S3 bucket behind a
CloudFront distribution (Origin Access Control, security headers, HTTPS via
the default CloudFront certificate), plus a GitHub Actions OIDC deploy role.
No custom domain yet — the site is served from the `*.cloudfront.net` URL
that `cdk deploy` outputs.

Written in TypeScript with AWS CDK v2, to match the site's own stack and stay
in a single language/toolchain.

## Cost

Realistically **$0/month**, within AWS's Always Free tier: S3 gives 5 GB of
storage free, CloudFront gives 1 TB of transfer and 10M requests/month free,
and CloudFront invalidations include 1,000 free paths/month (each deploy
here uses one `/*` invalidation). Actual cost depends on real traffic —
worth keeping an eye on AWS Cost Explorer or setting up an AWS Budget alert.

## Prerequisites

- An AWS account, with the AWS CLI installed and configured
  (`aws configure`) using an IAM user or role with sufficient permissions
  (`AdministratorAccess` is the simplest option for a personal project)
- Node.js 20+
- Confirm the CLI is pointed at the right account: `aws sts get-caller-identity`

## One-time setup

```bash
cd infra
npm install

# Only needed once per AWS account + region — provisions the small
# S3 bucket and IAM roles the CDK CLI itself uses to deploy stacks.
npx cdk bootstrap aws://<YOUR_ACCOUNT_ID>/us-east-1
```

## Deploy

```bash
cd infra
npx cdk diff      # optional: preview what would change
npx cdk deploy
```

`cdk deploy` prints outputs at the end, including:

- `SiteBucketName` — the S3 bucket name
- `DistributionId` — the CloudFront distribution ID
- `SiteUrl` — the live `https://xxxxx.cloudfront.net` URL
- `GithubActionsDeployRoleArn` — the IAM role ARN GitHub Actions assumes

The very first deploy takes roughly 15–20 minutes (CloudFront distributions
take time to propagate globally on creation). Content updates afterward are
much faster.

## First manual upload

`cdk deploy` only creates the infrastructure — it doesn't upload the site.
After the stack is deployed, do one manual sync (from the repo root, not
`infra/`) so the site isn't empty before the first automated deploy runs:

```bash
npm run build
aws s3 sync dist/ s3://<SiteBucketName> --delete
aws cloudfront create-invalidation --distribution-id <DistributionId> --paths "/*"
```

## Wiring up GitHub Actions (CI/CD)

The workflow at `.github/workflows/deploy.yml` deploys automatically on every
push to `main`: install → lint → build → sync to S3 → invalidate CloudFront.
It authenticates via OIDC (the role created above), so no AWS access keys are
stored in GitHub.

In the GitHub repo, go to **Settings → Secrets and variables → Actions →
Variables** and add three repository variables (these aren't secrets — the
role's trust policy already restricts who can assume it — but storing them
as variables keeps the workflow file generic):

| Variable | Value |
| --- | --- |
| `AWS_DEPLOY_ROLE_ARN` | the `GithubActionsDeployRoleArn` output |
| `AWS_S3_BUCKET` | the `SiteBucketName` output |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | the `DistributionId` output |

After that, any push to `main` (including merging a PR) deploys automatically.

## Teardown

```bash
cd infra
npx cdk destroy
```

This removes the S3 bucket (including its contents — `autoDeleteObjects` is
enabled since the bucket only ever holds a rebuildable build artifact),
the CloudFront distribution, the security headers policy, the IAM deploy
role and the GitHub OIDC provider. The one-time CDK bootstrap stack
(`CDKToolkit`) is left behind, since it's reusable by other projects in the
same AWS account/region — remove it separately from the CloudFormation
console if it's no longer needed anywhere.

## Adding a custom domain later

The stack already runs in `us-east-1` (required for CloudFront + ACM) so no
migration is needed. Adding a domain later means: a Route 53 hosted zone, an
ACM certificate (DNS-validated, `us-east-1`), and pointing the distribution's
`domainNames`/`certificate` props at them — plus an A/AAAA alias record in
Route 53 pointing at the distribution.
