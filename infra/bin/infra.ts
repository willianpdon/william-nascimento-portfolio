#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PortfolioStack } from "../lib/portfolio-stack";

const app = new cdk.App();

new PortfolioStack(app, "PortfolioStack", {
  env: {
    // us-east-1 is required if/when a CloudFront + ACM custom-domain
    // certificate is added later, so we start here to avoid a future
    // migration.
    region: "us-east-1",
  },
  description: "Static hosting for williamnascimento portfolio (S3 + CloudFront + GitHub OIDC deploy role).",
});
