import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { MyEnv } from "./euler-api-stack";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

export interface DynamoDbStackProps extends StackProps {
  readonly myEnv: MyEnv;
}

export class EulerDynamoDbStack extends Stack {
  constructor(scope: Construct, id: string, props: DynamoDbStackProps) {
    super(scope, id, props);

    const table = new Table(this, `euler-dynamodb-${props.myEnv.environment}`, {
      partitionKey: {
        name: "hash_key",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "range_key",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: props.myEnv.ddb_table_name,
    });
  }
}
