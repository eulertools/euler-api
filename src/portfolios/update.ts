import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PortfolioInput, PortfolioItemInput } from "./types";
import { corsHeaders, genericError } from "./utils/utils";
import { putDynamoItem } from "./utils/dynamoConnector";

export const updatePortfolio = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.headers?.authorization || event.headers?.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_id = event.pathParameters?.portfolio_id;
        if (!portfolio_id) throw "No portfolio id was provided";

        const portfolio_input = JSON.parse(event.body as string) as PortfolioInput;

        let portfolio_to_save = {
            ...portfolio_input,
            hash_key: `user~${user_id}`,
            range_key: portfolio_id
        }

        await putDynamoItem(process.env.DDB_TABLE_NAME, portfolio_to_save);

        return {
          statusCode: 200,
          body: JSON.stringify(portfolio_to_save),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Update Portfolio", JSON.stringify(err));
        return genericError(401, err);
    }
};

export const updatePortfolioItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.headers?.authorization || event.headers?.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_id = event.pathParameters?.portfolio_id;
        if (!portfolio_id) throw "No portfolio id was provided";

        const item_id = event.pathParameters?.item_id;
        if (!item_id) throw "No item id was provided";

        const portfolio_item_input = JSON.parse(event.body as string) as PortfolioItemInput;

        let portfolio_item_to_save = {
            ...portfolio_item_input,
            hash_key: portfolio_id,
            range_key: item_id
        }

        await putDynamoItem(process.env.DDB_TABLE_NAME, portfolio_item_to_save);

        return {
          statusCode: 200,
          body: JSON.stringify(portfolio_item_to_save),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Update Portfolio Item", JSON.stringify(err));
        return genericError(401, err);
    }
};