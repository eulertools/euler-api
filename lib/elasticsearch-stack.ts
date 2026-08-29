import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { MyEnv } from "./euler-api-stack";
import {Domain} from '@aws-cdk/aws-elasticsearch';

export interface elasticsearchStackProps extends StackProps {
  readonly myEnv: MyEnv;
}

export class ElasticsearchInfraStk extends Stack {
  constructor(scope: Construct, id: string, props: elasticsearchStackProps) {
    super(scope, id, props);
    const { myEnv } = props;

    const domainEndpoint = myEnv.elasticsearch_url;
    const domain = Domain.fromDomainEndpoint(
      this,
      "ImportedDomain",
      domainEndpoint
    );
  }
}
