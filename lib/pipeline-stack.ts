import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as pipelines from "@aws-cdk/pipelines";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Construct, Stack, StackProps, SecretValue } from "@aws-cdk/core";
import { DeployStage } from "./deployStage";
import { MyEnv } from "./euler-api-stack";

export interface PipelineStackProps extends StackProps {
  readonly githubToken: string;
  readonly gitHubOwner: string;
  readonly gitHubRepo: string;
  readonly myEnv: MyEnv;
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cdkOutputArtifact = new codepipeline.Artifact();

    const pipeline = new pipelines.CdkPipeline(
      this,
      `${props.myEnv.app_name}Pipeline`,
      {
        crossAccountKeys: false,
        pipelineName: `${props.myEnv.app_name}Pipeline${props.myEnv.environment}`,
        cloudAssemblyArtifact: cdkOutputArtifact,

        sourceAction: new codepipeline_actions.GitHubSourceAction({
          actionName: "GitHub",
          branch: props.myEnv.branch_name,
          owner: props.gitHubOwner,
          repo: props.gitHubRepo,
          oauthToken: SecretValue.secretsManager(props.githubToken),
          output: sourceArtifact,
        }),
        synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
          sourceArtifact: sourceArtifact,
          cloudAssemblyArtifact: cdkOutputArtifact,
          buildCommand: "npm run build",
        }),
      }
    );

    const deployStage = new DeployStage(
      this,
      `${props.myEnv.app_name}DeployStage${props.myEnv.environment}`,
      { env: props.env }
    );
    pipeline.addApplicationStage(deployStage);
  }
}
