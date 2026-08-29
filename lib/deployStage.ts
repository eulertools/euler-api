import { CfnOutput, Construct, Stage, StageProps } from "@aws-cdk/core";
import { EulerMainStack } from "./euler-api-stack";
import { myEnv } from "../config/env";
export class DeployStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new EulerMainStack(this, "Api", {
      env: myEnv.aws_env,
      myEnv: myEnv,
    });

    this.urlOutput = service.urlOutput;
  }
}
