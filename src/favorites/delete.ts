import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getDynamoQuery, deleteDynamoItem, getDynamoItem, updateDynamoItem } from './utils/dynamoConnector';
import { profile } from 'console';

export const deleteFavorite = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user_id = event.headers.authorization || event.headers.Authorization;
    if (!user_id) throw 'No user id was provided';

    const favorite_id = event.pathParameters?.favorite_id;
    if (!favorite_id) throw 'No favorite id was provided';
    if (favorite_id.substr(0, favorite_id.indexOf('~')) !== 'favorite') throw 'The favorite id is not correct';

    const favorite_items = await getDynamoQuery(process.env.DDB_TABLE_NAME, favorite_id);

    let proms = [];
    for (let i = 0; i < favorite_items.Items.length; i++) {
      proms.push(
        deleteDynamoItem(
          process.env.DDB_TABLE_NAME,
          favorite_items.Items[i].hash_key,
          favorite_items.Items[i].range_key,
        ),
      );
    }
    proms.push(deleteDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, favorite_id));

    await Promise.all(proms);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Succeded' }),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Favorites - Delete', JSON.stringify(err));
    return genericError(401, err);
  }
};
