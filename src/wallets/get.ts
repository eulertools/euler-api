import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getDynamoActiveItem, getDynamoQuery } from './utils/dynamoConnector';

function sortByOrder(a: any, b: any) {
  if (a.order > b.order) return 1;
  if (b.order > a.order) return -1;
  return 0;
}

export const getWallet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user_id = event.headers?.authorization || event.headers?.Authorization;
    if (!user_id) throw 'No user id was provided';

    const wallet_id = event.pathParameters?.wallet_id;
    if (!wallet_id) throw 'No wallet id was provided';

    let wallet_items: any = getDynamoQuery(process.env.DDB_TABLE_NAME, wallet_id);
    const wallet = await getDynamoActiveItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, wallet_id);

    wallet_items = await wallet_items;

    let response: any = {
      wallet: wallet.Item,
      items: wallet_items?.Items.sort(sortByOrder) || [],
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Wallets - Get', JSON.stringify(err));
    return genericError(401, err);
  }
};
