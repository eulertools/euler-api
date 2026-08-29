import { MyEnv } from "../lib/euler-api-stack";
const development:MyEnv = require("./env_development");

const environment: MyEnv = {
  ...development,
  aws_env: { account: "AWS_ACCOUNT_ID", region: "us-east-1" },
  branch_name: "bsc",
};

module.exports = environment;
