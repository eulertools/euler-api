import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getRkBegWithDynamoQuery } from './utils/dynamoConnector';

export const getWallets = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user_id = event.headers?.authorization || event.headers?.Authorization;
    if (!user_id) throw 'No user id was provided';
    const wallets = await getRkBegWithDynamoQuery(process.env.DDB_TABLE_NAME, `user~${user_id}`, 'wallet~');
    return {
      statusCode: 200,
      body: JSON.stringify(wallets.Items),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Wallets - List', JSON.stringify(err));
    return genericError(401, err);
  }
};
