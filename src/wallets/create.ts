import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders, genericError } from './utils/utils';
import { getDynamoItem, putDynamoItem, updateDynamoItem } from './utils/dynamoConnector';
import { WalletInput } from './types';
import { uuid } from 'uuidv4';

export const createWallet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    let user_id = event.headers?.authorization || event.headers?.Authorization;
    if (!user_id) throw 'No user id was provided';

    const wallet_input = JSON.parse(event.body as string) as WalletInput;
    user_id = wallet_input.user_id || user_id;

    let wallet_to_save = {
      ...wallet_input,
      hash_key: `user~${user_id}`,
      range_key: `wallet~${uuid()}`,
    };

    await putDynamoItem(process.env.DDB_TABLE_NAME, wallet_to_save);

    return {
      statusCode: 200,
      body: JSON.stringify(wallet_to_save),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('Wallets - Create Wallet', JSON.stringify(err));
    return genericError(401, err);
  }
};
