import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils/utils";
import { getDynamoActiveItem, getDynamoQuery } from "./utils/dynamoConnector";

function sortByOrder(a:any, b:any) {
    if (a.order > b.order) return 1;
    if (b.order > a.order) return -1;  
    return 0;
}

export const getPortfolio = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.headers?.authorization || event.headers?.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_id = event.pathParameters?.portfolio_id;
        if (!portfolio_id) throw "No portfolio id was provided";

        let portfolio_items: any =  getDynamoQuery(process.env.DDB_TABLE_NAME, portfolio_id);
        const portfolio = await getDynamoActiveItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, portfolio_id);

        portfolio_items = await portfolio_items;

        let response:any = {
            portfolio: portfolio.Item,
            items: portfolio_items?.Items.sort(sortByOrder) || []
        }

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Get", JSON.stringify(err));
        return genericError(401, err);
    }
};