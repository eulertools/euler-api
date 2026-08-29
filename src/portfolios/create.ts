import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils/utils";
import { checkUnicity, getDynamoItem, putDynamoItem, updateDynamoItem } from "./utils/dynamoConnector";
import { PortfolioInput, PortfolioItemInput } from "./types";
import { uuid } from 'uuidv4';

export const createPortfolio = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const user_id = event.headers?.authorization || event.headers?.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_input = JSON.parse(event.body as string) as PortfolioInput;

        let portfolio_to_save = {
            ...portfolio_input,
            num_of_wallets: 0,
            num_of_transactions: 0,
            num_of_tokens: 0,
            num_of_contracts: 0,
            hash_key: `user~${user_id}`,
            range_key: `portfolio~${uuid()}`
        }

        await putDynamoItem(process.env.DDB_TABLE_NAME, portfolio_to_save);

        return {
          statusCode: 200,
          body: JSON.stringify(portfolio_to_save),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Create Portfolio", JSON.stringify(err));
        return genericError(401, err);
    }
};

export const createPortfolioItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const user_id = event.headers?.authorization || event.headers?.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_id = event.pathParameters?.portfolio_id;
        if (!portfolio_id) throw "No portfolio id was provided";

        const portfolio_item_input = JSON.parse(event.body as string) as PortfolioItemInput;

        // Validate that the Portfolio exist and it is not deleted
        let portfolio = await getDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, portfolio_id);
        if (!portfolio || !portfolio.Item) throw `The portfolio ${portfolio_id} does not exist`;
        if (portfolio.Item.is_deleted) throw `The portfolio ${portfolio_id} is deleted. An item can't be added`;

        // Validate that the given Item does not exist in the Portfolio
        const unique_id = `${portfolio_id}~${portfolio_item_input.identifier.trim().toLowerCase()}~${portfolio_item_input.type}`;
        const uniqueness_check = await checkUnicity(process.env.DDB_TABLE_NAME, unique_id);
        if (!uniqueness_check.exist) throw `The item with type: ${portfolio_item_input.type} and identifier: ${portfolio_item_input.identifier}, already exist in the portfolio ${portfolio_id}`
        
        const portfolio_item_to_save = {
            ...portfolio_item_input,
            hash_key: portfolio_id,
            range_key: `${portfolio_item_input.type}~${uuid()}`,
            gsi1_hash_key: unique_id,
            is_deleted: false
        }

        // Create new Portfolio Item
        await putDynamoItem(process.env.DDB_TABLE_NAME, portfolio_item_to_save);

        // Update Portfolio
        delete portfolio.Item.hash_key;
        delete portfolio.Item.range_key;
        portfolio.Item[`num_of_${portfolio_item_to_save.type}s`]++;
        await updateDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, portfolio.Item, portfolio_id);

        return {
          statusCode: 200,
          body: JSON.stringify(portfolio_item_to_save),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Create Portfolio Item", JSON.stringify(err));
        return genericError(401, err);
    }
};