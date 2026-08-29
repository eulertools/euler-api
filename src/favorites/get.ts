import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getDynamoActiveItem, getDynamoQuery } from './utils/dynamoConnector';

function sortByOrder(a: any, b: any) {
  if (a.order > b.order) return 1;
  if (b.order > a.order) return -1;
  return 0;
}

export const getFavorite = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user_id = event.headers?.authorization || event.headers?.Authorization;
    if (!user_id) throw 'No user id was provided';

    const favorite_id = event.pathParameters?.favorite_id;
    if (!favorite_id) throw 'No favorite id was provided';

    let favorite_items: any = getDynamoQuery(process.env.DDB_TABLE_NAME, favorite_id);
    const favorite = await getDynamoActiveItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, favorite_id);

    favorite_items = await favorite_items;

    let response: any = {
      favorite: favorite.Item,
      items: favorite_items?.Items.sort(sortByOrder) || [],
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Favorites - Get', JSON.stringify(err));
    return genericError(401, err);
  }
};
