import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Duration, StackProps, CfnOutput, SecretValue } from '@aws-cdk/core';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { JsonSchema, Resource } from '@aws-cdk/aws-apigateway';
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources/lib/dynamodb';
import { tradesSchema, symbolsListSchema } from '../src/bitqueryIntegration/schema';
import { portfolioSchema, portfolioItemSchema } from '../src/portfolios/schema';
import { StartingPosition } from '@aws-cdk/aws-lambda/lib/event-source-mapping';
import { favoriteSchema } from '../src/favorites/schema';
import { feedbackSchema } from '../src/feedback/schema';
import { walletSchema } from '../src/wallets/schema';

export interface MyEnv {
  readonly aws_env: { readonly account: string; readonly region: string };
  readonly environment: string;
  readonly branch_name: string;
  readonly app_name: string;
  readonly ddb_table_name: string;
  readonly athena_user_secret_key: string;
  readonly athena_user_access_key: string;
  readonly users_table_name: string;
  readonly vpc_id: string;
  readonly subnet_ids: string[];
  readonly customApiDomain: string;
  readonly customApiDomainHostedZone: string;
  readonly tokens_table_name: string;
  readonly elasticsearch_url: string;
  readonly tokens_table_stream_arn: string;
  readonly catalog_table_name: string;
}

export interface EulerStackProps extends StackProps {
  readonly myEnv: MyEnv;
}

type DynamoDbActions = {
  tableArn: string;
  read?: boolean;
  write?: boolean;
};

type EnvVariables = {
  [key: string]: string;
};

interface CustOptions {
  name: string;
  httpMethod: string;
  authorizer?: apigateway.RequestAuthorizer;
  handlerPath: string;
  handlerName: string;
  envVariables?: EnvVariables;
  codePath: string;
  dynamoDb?: DynamoDbActions;
  vpc?: ec2.IVpc;
  securityGroups?: ec2.ISecurityGroup[];
  athena?: boolean;
}

const lambaDefaultProps = {
  runtime: lambda.Runtime.NODEJS_12_X,
  timeout: Duration.minutes(15),
  memorySize: 3096,
};

const httpMethods = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  ANY: 'ANY',
};

export class EulerMainStack extends cdk.Stack {
  public readonly urlOutput: CfnOutput;
  private myEnv: MyEnv;
  private api: apigateway.RestApi;
  private authorizer: apigateway.RequestAuthorizer;
  private dynamoDbTable: ddb.ITable;
  private userTable: ddb.ITable;
  private catalogTable: ddb.ITable;
  private tokenTable: ddb.ITable;
  private defaultVpc: ec2.IVpc;
  private securityGroups: ec2.ISecurityGroup[];
  private myRequestBodyValidator: apigateway.RequestValidator;
  private athenaUserAccessKey: string;
  private athenaUserSecretKey: string;

  constructor(scope: cdk.Construct, id: string, props: EulerStackProps) {
    super(scope, id, props);

    this.myEnv = props.myEnv;

    this.api = new apigateway.RestApi(this, `${this.myEnv.app_name}Api${this.myEnv.environment}`, {
      description: `Euler Api | Env: ${this.myEnv.environment}`,
      deploy: true,
      deployOptions: {
        stageName: this.myEnv.environment,
        variables: { env: this.myEnv.environment },
      },
      defaultCorsPreflightOptions: {
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    this.athenaUserSecretKey = SecretValue.secretsManager(this.myEnv.athena_user_secret_key).toString();
    this.athenaUserAccessKey = SecretValue.secretsManager(this.myEnv.athena_user_access_key).toString();

    this.myRequestBodyValidator = new apigateway.RequestValidator(this, 'bodyRequestValidator', {
      validateRequestBody: true,
      restApi: this.api,
      requestValidatorName: 'bodyRequestValidator',
    });

    new apigateway.GatewayResponse(this, 'badrequest', {
      restApi: this.api,
      type: apigateway.ResponseType.BAD_REQUEST_BODY,
      statusCode: '400',
      templates: {
        'application/json': `{"error":$context.error.messageString,"exception":"$context.error.validationErrorString"}`,
      },
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers': "'*'",
      },
    });

    const customDomain = apigateway.DomainName.fromDomainNameAttributes(this, 'customDomain', {
      domainName: this.myEnv.customApiDomain,
      domainNameAliasHostedZoneId: this.myEnv.customApiDomainHostedZone,
      domainNameAliasTarget: '',
    });

    new apigateway.BasePathMapping(this, 'CustomBasePathMapping', {
      domainName: customDomain,
      restApi: this.api,
      basePath: 'bsc',
      stage: this.api.deploymentStage,
    });

    this.dynamoDbTable = ddb.Table.fromTableName(this, 'EulerDynamoDB', this.myEnv.ddb_table_name);

    this.userTable = ddb.Table.fromTableName(this, 'UserDynamoDB', this.myEnv.users_table_name);
    this.catalogTable = ddb.Table.fromTableName(this, 'CatalogDynamoDB', this.myEnv.catalog_table_name);
    this.tokenTable = ddb.Table.fromTableAttributes(this, 'TokensDbStream', {
      tableName: this.myEnv.tokens_table_name,
      tableStreamArn: this.myEnv.tokens_table_stream_arn,
    });
    this.createTokensTableStream();

    // this.securityGroups = [
    //   ec2.SecurityGroup.fromSecurityGroupId(
    //     this,
    //     "SG",
    //     "sg-09ffdb51fe31a0a08"
    //   )
    // ];

    this.authorizer = this.createAuthorizer();
    this.createVersion();
    this.createTokenTransfers();
    this.createBitqueryIntegration();
    this.createAthenaQueries();
    //this.createBscApiIntegration();
    this.createWeb3Integration();
    this.createBscGraphIntegration();
    this.createPortfolios();
    this.createFavorites();
    this.createWallets();
    this.createEulerInfo();
    this.createFeedback();
    this.createWaultServices();

    this.urlOutput = new CfnOutput(this, 'Url', {
      value: this.api.url,
    });
  }

  createTokensTableStream() {
    let dynamoDbStream = new DynamoEventSource(this.tokenTable, { startingPosition: StartingPosition.TRIM_HORIZON });
    let dynamoDbStreamFunction = new lambda.Function(this, 'indexTokens', {
      ...lambaDefaultProps,
      code: new lambda.AssetCode('src/dynamoDbStreams'),
      handler: 'index-tokens.handler',
      environment: { ELASTIC_ENDPOINT: this.myEnv.elasticsearch_url },
    });
    dynamoDbStreamFunction.addEventSource(dynamoDbStream);
  }

  createAuthorizer(): apigateway.RequestAuthorizer {
    const authorizerLambda = new lambda.Function(this, 'authorizer', {
      ...lambaDefaultProps,
      code: new lambda.AssetCode('src/authorizer'),
      handler: 'authorizer.handler',
      environment: {},
    });

    return new apigateway.RequestAuthorizer(this, 'auth', {
      handler: authorizerLambda,
      identitySources: [apigateway.IdentitySource.header('Authorization')],
    });
  }

  createVersion() {
    this.createLambdaIntegration(this, {
      handlerPath: 'src/version/',
      handlerName: 'get.walletBalanceByHandler',
      name: 'version',
      codePath: './src/version',
      authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
    });
  }

  createWeb3Integration() {
    this.createLambdaIntegration(this, {
      handlerPath: 'src/web3Integration/',
      handlerName: 'get.transactionDetails',
      name: 'transactionDetails',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
      codePath: './src/web3Integration',
    });

    this.createLambdaIntegration(this, {
      handlerPath: 'src/web3Integration/',
      handlerName: 'get.walletBalanceByToken',
      name: 'getBalanceByAddress',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
      codePath: './src/web3Integration',
    });

    this.createLambdaIntegration(this, {
      handlerPath: 'src/web3Integration/',
      handlerName: 'get.walletBalance',
      name: 'getBalance',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
      codePath: './src/web3Integration',
    });

    this.createLambdaIntegration(this, {
      handlerPath: 'src/web3Integration/',
      handlerName: 'get.pancakePoolBalance',
      name: 'pancakePoolBalance',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
      codePath: './src/web3Integration',
    });
  }

  createTokenTransfers() {
    this.createLambdaIntegration(this, {
      handlerPath: 'src/tokenTransfers/',
      handlerName: 'post.handler',
      name: 'tokenTransfers',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.POST,
      codePath: './src/tokenTransfers',
      vpc: this.defaultVpc,
      //securityGroups: this.securityGroups,
    });
  }

  createWaultServices() {
    const wswapIntegrationResource = this.api.root.addResource('wswap');
    const pairsResource = wswapIntegrationResource.addResource('pairs');

    this.createLambdaIntegration(this, {
      handlerPath: '',
      handlerName: 'get.getPairs',
      name: 'get',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
      codePath: './src/waultServices',
      dynamoDb: { tableArn: this.catalogTable.tableArn, read: true },
      envVariables: { DDB_TABLE_NAME: this.myEnv.catalog_table_name },
    });
  }

  createBitqueryIntegration() {
    const bitqueryIntegrationResource = this.api.root.addResource('bitquery-integration');
    const tradesResource = bitqueryIntegrationResource.addResource('trades');
    const symbolsListResource = bitqueryIntegrationResource.addResource('symbols-list');

    let tSchema = this.getApiModel('candleDataSchema', tradesSchema);
    let slSchema = this.getApiModel('symbolListSchema', symbolsListSchema);

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'post.getTrades',
        name: 'post',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/bitqueryIntegration',
        dynamoDb: {
          tableArn: this.dynamoDbTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
      },
      tradesResource,
      tSchema,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'post.getSymbolsList',
        name: 'post',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/bitqueryIntegration',
        dynamoDb: {
          tableArn: this.dynamoDbTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
      },
      symbolsListResource,
      slSchema,
    );
  }

  createAthenaQueries() {
    const athenaRootResource = this.api.root.addResource('athena');

    const blocksResource = athenaRootResource.addResource('blocks');
    const blocksCountResource = blocksResource.addResource('count');
    const blocksCountSumResource = blocksCountResource.addResource('sum');

    const transactionsResource = athenaRootResource.addResource('transactions');
    const transactionsCountResource = transactionsResource.addResource('count');

    const tokenTransfersResource = athenaRootResource.addResource('token-transfers');
    const tokenTransfersCountResource = tokenTransfersResource.addResource('count');
    const tokenTransfersDistinctCountResource = tokenTransfersCountResource.addResource('distinct');
    const firstTokenTransferResource = tokenTransfersResource.addResource('first');

    const tokensResource = athenaRootResource.addResource('tokens');
    const tokensListResource = tokensResource.addResource('list');

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'getBlocksCountSum.handler',
        name: 'getBlocksCountSum',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      blocksCountSumResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'getBlocksCount.handler',
        name: 'getBlocksCount',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      blocksCountResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'getTransactionsCount.handler',
        name: 'getTransactionsCount',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      transactionsCountResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'getFirstTokenTransfer.handler',
        name: 'getFirstTokenTransfer',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      firstTokenTransferResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'getContractsCount.handler',
        name: 'getContractsCount',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      tokenTransfersDistinctCountResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'getToken.handler',
        name: 'getToken',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      tokensResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'listTokens.handler',
        name: 'listTokens',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/athena',
        athena: true,
        envVariables: {
          ATH_ACCESS_KEY_ID: this.athenaUserAccessKey,
          ATH_SECRET_ACCESS_KEY: this.athenaUserSecretKey,
        },
      },
      tokensListResource,
    );
  }

  // createBscApiIntegration() {
  //   const bscRootResource = this.api.root.addResource('bsc');

  //   // Accounts Wrapper https://bscscan.com/apis#accounts
  //   const accountsResource = bscRootResource.addResource('accounts');
  //   const balanceResource = accountsResource.addResource('balance'); // Get BNB Balance for a single Address
  //   const balanceListResource = balanceResource.addResource('list'); // Get BNB Balance for multiple Addresses in a single call
  //   const accountTransactionsResource = accountsResource.addResource('transactions');
  //   const normalTransactionsResource = accountTransactionsResource.addResource('normal'); // Get a list of 'Normal' Transactions By Address
  //   const internalTransactionsResource = accountTransactionsResource.addResource('internal');
  //   const internalByAddressResource = internalTransactionsResource.addResource('address');
  //   const internalByAddressArgResource = internalByAddressResource.addResource('{address}');  // Get a list of 'Internal' Transactions by Address
  //   const internalByHashResource = internalTransactionsResource.addResource('hash');
  //   const internalByHashArgResource = internalByHashResource.addResource('{hash}');  // Get "Internal Transactions" by Transaction Hash
  //   const internalByBlocksResource = internalTransactionsResource.addResource('blocks'); // Get "Internal Transactions" by Block Range
  //   const tokenTransferResource = accountsResource.addResource('token-transfer-events');
  //   const tokenInstanceResource = tokenTransferResource.addResource('{token}');
  //   const tokenAddressResource = tokenInstanceResource.addResource('{address}'); // Get a list of "ERC721 or BEP-20 - Token Transfer Events" by Address
  //   const validatedBlocksResource = accountsResource.addResource('validated-blocks'); // Get list of Blocks Validated by Address

  //   // Contracts Wrapper https://bscscan.com/apis#contracts
  //   const contractsResource = bscRootResource.addResource('contracts');
  //   const abiResource = contractsResource.addResource('abi'); // Get Contract ABI for Verified Contract Source Codes
  //   const sourceCodeResource = contractsResource.addResource('source-code'); // Get Contract Source Code for Verified Contract Source Codes

  //   // Transactions Wrapper https://bscscan.com/apis#transactions
  //   const transactionsResource = bscRootResource.addResource('transactions');
  //   const receiptStatusResource = transactionsResource.addResource('receipt-status'); // Check Transaction Receipt Status

  //   // Blocks Wrapper https://bscscan.com/apis#blocks
  //   const blocksResource = bscRootResource.addResource('blocks');
  //   const uncleRewardsResource = blocksResource.addResource('uncle-rewards'); // Get Block And Uncle Rewards by BlockNo
  //   const estimatedCountdownTimeResource = blocksResource.addResource('estimated-countdown-time'); // Get Estimated Block Countdown Time by BlockNo
  //   const numberByTimestampResource = blocksResource.addResource('number'); // Get Block Number by Timestamp

  //   // Geth/Parity Proxy APIs https://bscscan.com/apis#proxy
  //   const gethResource = bscRootResource.addResource('geth');
  //   const mostRecentBlockResource = gethResource.addResource('most-recent-block'); // Returns the number of most recent block
  //   const blockInfoResource = gethResource.addResource('block-info'); // Returns information about a block by block number
  //   const blockTrxCountResource = gethResource.addResource('block-trx-count'); // Returns the number of transactions in a block from a block matching the given block number
  //   const trxInfoByHashResource = gethResource.addResource('transaction-info-by-hash'); // Returns the information about a transaction requested by transaction hash
  //   const blockInfoByBlocknoResource = gethResource.addResource('transaction-info-by-blockno'); // Returns information about a transaction by block number and transaction index position
  //   const addressTransactionsResource = gethResource.addResource('address-transactions'); // Returns the number of transactions sent from an address
  //   const trxRecByHashResource = gethResource.addResource('trx-receipt-by-hash'); // Returns the receipt of a transaction by transaction hash
  //   const addressCodeResource = gethResource.addResource('address-code'); // Returns code at a given address
  //   const gasPriceResource = gethResource.addResource('gas-price'); // Returns the current price per gas in wei

  //   // Token Wrapper https://bscscan.com/apis#tokens
  //   const tokenResource = bscRootResource.addResource('token');
  //   const supplyResource = tokenResource.addResource('supply'); // Get BEP20-Token TotalSupply (aka MaxSupply) by ContractAddress
  //   const circulatingSupplyResource = tokenResource.addResource('circulating-supply'); // Get BEP20-Token Circulating Supply (Applicable for Binance Cross Chain token Types) by ContractAddress
  //   const accountBalanceResource = tokenResource.addResource('account-balance'); // Get BEP20-Token Account Balance for TokenContractAddress

  //   const dynamoFullAccess =  { read: true, write: true };

  //   // Accounts Lambdas
  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getBalanceByAddress',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     balanceResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.listBalances',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     balanceListResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getNormalTransactionsByAddress',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     normalTransactionsResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getInternalTransactionsByAddress',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     internalByAddressArgResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getInternalTransactionsByHash',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     internalByHashArgResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getInternalTransactionsByBlocks',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     internalByBlocksResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getTokenTransferEventsByAddress',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     tokenAddressResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'accounts.getTvalidatedBlocks',
  //       name: 'accounts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     validatedBlocksResource
  //   );

  //   // Contracts Lambdas
  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'contracts.getContractAbiByAddress',
  //       name: 'contracts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     abiResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'contracts.getContractSourceCodeByAddress',
  //       name: 'contracts',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     sourceCodeResource
  //   );

  //   // Transactions Lambdas
  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'transactions.checkReceiptStatus',
  //       name: 'transactions',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     receiptStatusResource
  //   );

  //   // Blocks Lambdas
  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'blocks.getUncleRewards',
  //       name: 'blocks',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     uncleRewardsResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'blocks.getEstimatedCountdownTime',
  //       name: 'blocks',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     estimatedCountdownTimeResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'blocks.getNumberByTimestamp',
  //       name: 'blocks',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     numberByTimestampResource
  //   );

  //   // GETH Lambdas
  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getMostRecentBlockNumber',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     mostRecentBlockResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getBlockByNumber',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     blockInfoResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getBlockTrxCountByNumber',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     blockTrxCountResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getTrxByHash',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     trxInfoByHashResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getTrxByBlocknoAndIndex',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     blockInfoByBlocknoResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getTrxCount',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     addressTransactionsResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getTrxReceipt',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     trxRecByHashResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getSourceCode',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     addressCodeResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'geth.getGasPrice',
  //       name: 'geth',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     gasPriceResource
  //   );

  //   // Token Lambdas
  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'token.getSupplyByContractAddress',
  //       name: 'token',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     supplyResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'token.getCirculatingSupplyByContractAddress',
  //       name: 'token',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     circulatingSupplyResource
  //   );

  //   this.createLambdaIntegration(
  //     this,
  //     {
  //       handlerPath: '',
  //       handlerName: 'token.getAccountBalanceByContractAddress',
  //       name: 'token',
  //       //authorizer: this.authorizer,
  //       httpMethod: httpMethods.GET,
  //       codePath: './src/bscIntegration',
  //       dynamoDb: dynamoFullAccess,
  //       envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
  //     },
  //     accountBalanceResource
  //   );
  // }

  createBscGraphIntegration() {
    this.createLambdaIntegration(this, {
      handlerPath: '',
      handlerName: 'get.getSymbolsPairs',
      name: 'symbols-pairs',
      //authorizer: this.authorizer,
      httpMethod: httpMethods.GET,
      codePath: './src/bscGraphIntegration',
    });
  }

  createEulerInfo() {
    // Resources
    const eulerResource = this.api.root.addResource('euler');
    const destroyedTokensResource = eulerResource.addResource('destroyed-tokens');
    const getTokenResource = eulerResource.addResource('token');
    const getTokenBySymbolResource = getTokenResource.addResource('symbol');
    const getTokenBySymbolParamResource = getTokenBySymbolResource.addResource('{symbol}');
    const getTokenByBscHashResource = getTokenResource.addResource('bsc');
    const getTokenByBscHashParamResource = getTokenByBscHashResource.addResource('{bsc}');
    const getTokenByEthHashResource = getTokenResource.addResource('eth');
    const getTokenByEthHashParamResource = getTokenByEthHashResource.addResource('{eth}');

    // Functions
    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getDestroyedTokens',
        name: 'getDestroyedTokens',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/euler',
        dynamoDb: {
          tableArn: this.dynamoDbTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.ddb_table_name },
      },
      destroyedTokensResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.listMainTokens',
        name: 'listMainTokens',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/euler',
        dynamoDb: {
          tableArn: this.tokenTable.tableArn,
          read: true,
        },
        envVariables: { TOKEN_TABLE_NAME: this.myEnv.tokens_table_name },
      },
      getTokenResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getTokenBySymbol',
        name: 'getTokenBySymbol',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/euler',
        dynamoDb: {
          tableArn: this.tokenTable.tableArn,
          read: true,
        },
        envVariables: { TOKEN_TABLE_NAME: this.myEnv.tokens_table_name },
      },
      getTokenBySymbolParamResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getTokenByBscHash',
        name: 'getTokenByBscHash',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/euler',
        dynamoDb: {
          tableArn: this.tokenTable.tableArn,
          read: true,
        },
        envVariables: { TOKEN_TABLE_NAME: this.myEnv.tokens_table_name },
      },
      getTokenByBscHashParamResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getTokenByEthHash',
        name: 'getTokenByEthHash',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/euler',
        dynamoDb: {
          tableArn: this.tokenTable.tableArn,
          read: true,
        },
        envVariables: { TOKEN_TABLE_NAME: this.myEnv.tokens_table_name },
      },
      getTokenByEthHashParamResource,
    );
  }

  createFeedback() {
    // Resources
    const feedbackResource = this.api.root.addResource('feedback');

    // Models
    const feedbackModel = this.getApiModel('feedbackModel', feedbackSchema);

    // Functions
    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'post.sendFeedback',
        name: 'post',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/feedback',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      feedbackResource,
      feedbackModel,
    );
  }

  createPortfolios() {
    // Resources
    const portfoliosResource = this.api.root.addResource('portfolios');
    const portfolioDetailResource = portfoliosResource.addResource('{portfolio_id}');
    const portfolioItemDetailResource = portfolioDetailResource.addResource('{item_id}');

    // Models
    const portfolioItemModel = this.getApiModel('portfolioItemModel', portfolioItemSchema);
    const portfolioModel = this.getApiModel('portfolioModel', portfolioSchema);

    // Functions
    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'list.getPortfolios',
        name: 'list',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/portfolios',
        dynamoDb: { tableArn: this.userTable.tableArn, read: true },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfoliosResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getPortfolio',
        name: 'get',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/portfolios',
        dynamoDb: { tableArn: this.userTable.tableArn, read: true },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfolioDetailResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'create.createPortfolio',
        name: 'create',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/portfolios',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfoliosResource,
      portfolioModel,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'update.updatePortfolio',
        name: 'update',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.PUT,
        codePath: './src/portfolios',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfolioDetailResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'delete.deletePortfolio',
        name: 'delete',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.DELETE,
        codePath: './src/portfolios',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfolioDetailResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'create.createPortfolioItem',
        name: 'create',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/portfolios',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfolioDetailResource,
      portfolioItemModel,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'update.updatePortfolioItem',
        name: 'update',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.PUT,
        codePath: './src/portfolios',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfolioItemDetailResource,
      portfolioItemModel,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'delete.deletePortfolioItem',
        name: 'delete',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.DELETE,
        codePath: './src/portfolios',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      portfolioItemDetailResource,
    );
  }

  createFavorites() {
    // Resources
    const favoritesResource = this.api.root.addResource('favorites');
    const favoriteDetailResource = favoritesResource.addResource('{favorite_id}');

    // Models
    const favoriteModel = this.getApiModel('favoriteModel', favoriteSchema);

    // Functions
    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'list.getFavorites',
        name: 'list',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/favorites',
        dynamoDb: { tableArn: this.userTable.tableArn, read: true },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      favoritesResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getFavorite',
        name: 'get',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/favorites',
        dynamoDb: { tableArn: this.userTable.tableArn, read: true },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      favoriteDetailResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'create.createFavorite',
        name: 'create',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/favorites',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      favoritesResource,
      favoriteModel,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'delete.deleteFavorite',
        name: 'delete',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.DELETE,
        codePath: './src/favorites',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      favoriteDetailResource,
    );
  }

  createWallets() {
    // Resources
    const walletsResource = this.api.root.addResource('wallets');
    const walletDetailResource = walletsResource.addResource('{wallet_id}');

    // Models
    const walletModel = this.getApiModel('walletModel', walletSchema);

    // Functions
    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'list.getWallets',
        name: 'list',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/wallets',
        dynamoDb: { tableArn: this.userTable.tableArn, read: true },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      walletsResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'get.getWallet',
        name: 'get',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.GET,
        codePath: './src/wallets',
        dynamoDb: { tableArn: this.userTable.tableArn, read: true },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      walletDetailResource,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'create.createWallets',
        name: 'create',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.POST,
        codePath: './src/wallets',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      walletsResource,
      walletModel,
    );

    this.createLambdaIntegration(
      this,
      {
        handlerPath: '',
        handlerName: 'delete.deleteWallet',
        name: 'delete',
        //authorizer: this.authorizer,
        httpMethod: httpMethods.DELETE,
        codePath: './src/wallets',
        dynamoDb: {
          tableArn: this.userTable.tableArn,
          read: true,
          write: true,
        },
        envVariables: { DDB_TABLE_NAME: this.myEnv.users_table_name },
      },
      walletDetailResource,
    );
  }

  getApiModel(name: string, schema: JsonSchema): apigateway.Model {
    return new apigateway.Model(this, name, {
      modelName: name,
      restApi: this.api,
      schema: schema,
      contentType: 'application/json',
    });
  }

  getLambdaFunction(scope: cdk.Stack, custOptions: CustOptions): lambda.Function {
    const options: lambda.FunctionProps = {
      ...lambaDefaultProps,
      handler: `${custOptions.handlerPath}${custOptions.handlerName}`,
      environment: custOptions.envVariables || {},
      code: new lambda.AssetCode(custOptions.codePath),
      vpc: custOptions.vpc,
      securityGroups: custOptions.securityGroups,
    };

    const funct = new lambda.Function(
      scope,
      `${custOptions.name}_${custOptions.handlerName}_${custOptions.httpMethod.toLowerCase()}`,
      options,
    );

    if (custOptions.dynamoDb) {
      const actions: string[] = [];
      if (custOptions.dynamoDb.read) {
        actions.push('dynamodb:GetItem');
        actions.push('dynamodb:Query');
        actions.push('dynamodb:BatchGetItem');
      }
      if (custOptions.dynamoDb.write) {
        actions.push('dynamodb:UpdateItem');
        actions.push('dynamodb:PutItem');
      }
      funct.addToRolePolicy(
        new PolicyStatement({
          actions: actions,
          resources: [`${custOptions.dynamoDb.tableArn}/index/*`, custOptions.dynamoDb.tableArn],
        }),
      );
    }

    if (custOptions.vpc) {
      let actions: string[] = [];
      actions.push('ec2:CreateNetworkInterface');
      actions.push('ec2:DescribeNetworkInterfaces');
      actions.push('ec2:DeleteNetworkInterface');
      funct.addToRolePolicy(
        new PolicyStatement({
          actions: actions,
          resources: ['*'],
        }),
      );
    }

    if (custOptions.athena) {
      funct.addToRolePolicy(
        new PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:*', 'athena:*', 'glue:*', 'sns:*', 'cloudwatch:*', 'lakeformation:*'],
          resources: ['*'],
        }),
      );
    }
    return funct;
  }

  createLambdaIntegration(
    scope: cdk.Stack,
    custOptions: CustOptions,
    resource?: Resource,
    model?: apigateway.Model,
  ): void {
    const funct = this.getLambdaFunction(scope, custOptions);

    const apiResource = resource || this.api.root.addResource(custOptions.name);
    apiResource.addMethod(custOptions.httpMethod, new apigateway.LambdaIntegration(funct), {
      authorizer: custOptions.authorizer,
      requestValidator: model ? this.myRequestBodyValidator : undefined,
      requestModels: model ? { 'application/json': model } : undefined,
    });
  }
}
