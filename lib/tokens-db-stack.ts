import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { MyEnv } from "./euler-api-stack";
import { Table, AttributeType, BillingMode, StreamViewType } from "@aws-cdk/aws-dynamodb";

export interface DynamoDbStackProps extends StackProps {
  readonly myEnv: MyEnv;
}

export class TokensDbStack extends Stack {
  constructor(scope: Construct, id: string, props: DynamoDbStackProps) {
    super(scope, id, props);

    const table = new Table(this, `euler-tokens-db-${props.myEnv.environment}`, {
      partitionKey: {
        name: "hash_key",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: props.myEnv.tokens_table_name,
      stream: StreamViewType.NEW_AND_OLD_IMAGES
    });

    table.addGlobalSecondaryIndex({
      indexName: "ethereum_hash",
      partitionKey: {
        name: "gsi_eth_hash",
        type: AttributeType.STRING
      }
    });

    table.addGlobalSecondaryIndex({
      indexName: "bsc_hash",
      partitionKey: {
        name: "gsi_bsc_hash",
        type: AttributeType.STRING
      }
    });

    table.addGlobalSecondaryIndex({
      indexName: "main_tkn",
      partitionKey: {
        name: "gsi_main_tkn",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "gsi_main_tkn_order",
        type: AttributeType.NUMBER
      }
    });
  }
}
