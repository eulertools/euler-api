import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { MyEnv } from "./euler-api-stack";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

export interface DynamoDbStackProps extends StackProps {
  readonly myEnv: MyEnv;
}

export class UsersDbStack extends Stack {
  constructor(scope: Construct, id: string, props: DynamoDbStackProps) {
    super(scope, id, props);

    const table = new Table(this, `euler-users-db-${props.myEnv.environment}`, {
      partitionKey: {
        name: "hash_key",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "range_key",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: props.myEnv.users_table_name,
    });

    table.addGlobalSecondaryIndex({ 
      indexName: "gsi_unicity", 
      partitionKey: {
        name: "gsi_unicity",
        type: AttributeType.STRING
      }
    });

  }
}
