import { MyEnv } from "../lib/euler-api-stack";
const development:MyEnv = require("./env_development");

const environment: MyEnv = {
  ...development,
  aws_env: { account: "AWS_ACCOUNT_ID", region: "us-east-1" },
  branch_name: "production",
  vpc_id: "vpc-PLACEHOLDER",
  customApiDomain: "api.prod.euler.tools",
  customApiDomainHostedZone: "HOSTED_ZONE_ID",
  elasticsearch_url: "https://elastic.prod.euler.tools",
  subnet_ids: [
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
  ],
};

module.exports = environment;
