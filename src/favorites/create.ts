import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getDynamoItem, putDynamoItem, updateDynamoItem } from './utils/dynamoConnector';
import { FavoriteInput } from './types';
import { uuid } from 'uuidv4';

export const createFavorite = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user_id = event.headers?.authorization || event.headers?.Authorization;
    if (!user_id) throw 'No user id was provided';

    const favorite_input = JSON.parse(event.body as string) as FavoriteInput;

    let favorite_to_save = {
      ...favorite_input,
      hash_key: `user~${user_id}`,
      range_key: `favorite~${uuid()}`,
    };

    await putDynamoItem(process.env.DDB_TABLE_NAME, favorite_to_save);

    return {
      statusCode: 200,
      body: JSON.stringify(favorite_to_save),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Favorites - Create Favorite', JSON.stringify(err));
    return genericError(401, err);
  }
};
