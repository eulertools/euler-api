import { MyEnv } from "../lib/euler-api-stack";
import { env } from "./env";

const environment: MyEnv = {
  app_name: "euler",
  aws_env: { account: "AWS_ACCOUNT_ID", region: "us-east-1" },
  environment: env,
  branch_name: "development",
  ddb_table_name: "euler-cache-table",
  users_table_name: "euler-users-table",
  tokens_table_name: "euler-tokens-table",
  catalog_table_name: "entities-catalog",
  athena_user_secret_key: "athena_user_secret_key",
  athena_user_access_key: "athena_user_access_key",
  customApiDomain: "api.dev.euler.tools",
  customApiDomainHostedZone: "HOSTED_ZONE_ID",
  vpc_id: "vpc-PLACEHOLDER",
  subnet_ids: [
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
    "subnet-PLACEHOLDER",
  ],
  elasticsearch_url: "https://elastic.dev.euler.tools",
  tokens_table_stream_arn:
    "arn:aws:dynamodb:us-east-1:AWS_ACCOUNT_ID:table/euler-tokens-table/stream/2021-04-24T11:30:24.869",
};

module.exports = environment;
