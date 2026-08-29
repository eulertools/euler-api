import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getDynamoQuery, deleteDynamoItem, getDynamoItem, updateDynamoItem } from './utils/dynamoConnector';
import { profile } from 'console';

export const deleteWallet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user_id = event.headers.authorization || event.headers.Authorization;
    if (!user_id) throw 'No user id was provided';

    const wallet_id = event.pathParameters?.wallet_id;
    if (!wallet_id) throw 'No wallet id was provided';
    if (wallet_id.substr(0, wallet_id.indexOf('~')) !== 'wallet') throw 'The wallet id is not correct';

    const wallet_items = await getDynamoQuery(process.env.DDB_TABLE_NAME, wallet_id);

    let proms = [];
    for (let i = 0; i < wallet_items.Items.length; i++) {
      proms.push(
        deleteDynamoItem(process.env.DDB_TABLE_NAME, wallet_items.Items[i].hash_key, wallet_items.Items[i].range_key),
      );
    }
    proms.push(deleteDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, wallet_id));

    await Promise.all(proms);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Succeded' }),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Wallets - Delete', JSON.stringify(err));
    return genericError(401, err);
  }
};
