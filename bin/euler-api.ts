import * as cdk from "@aws-cdk/core";
import { PipelineStack } from "../lib/pipeline-stack";
import { myEnv } from "../config/env";
import { EulerMainStack } from "../lib/euler-api-stack";
import { EulerDynamoDbStack } from "../lib/euler-dynamodb-stack";
import { UsersDbStack } from "../lib/users-db-stack";
import { TokensDbStack } from "../lib/tokens-db-stack";
import { ElasticsearchInfraStk } from "../lib/elasticsearch-stack";

const app = new cdk.App();

new PipelineStack(app, `Pipeline${myEnv.app_name}${myEnv.environment}`, {
  githubToken: "githubToken",
  gitHubRepo: "euler-api",
  gitHubOwner: "eulertools",
  env: myEnv.aws_env,
  myEnv,
});

new EulerDynamoDbStack(app, `EulerDynamoDbStack-${myEnv.environment}`, {
  myEnv,
});

new UsersDbStack(app, `UsersDbStack-${myEnv.environment}`, {
  myEnv,
});

new TokensDbStack(app, `TokensDbStk${myEnv.environment}`, {
  myEnv,
});

new ElasticsearchInfraStk(app, `ElasticsearchInfraStack-${myEnv.environment}`, {
  myEnv
});

new EulerMainStack(app, `${myEnv.app_name}CdkStk${myEnv.environment}`, {
  myEnv,
});

app.synth();
