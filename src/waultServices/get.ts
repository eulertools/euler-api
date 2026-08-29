import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils/utils";

export const getPairs = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.headers?.authorization || event.headers?.Authorization;
        if (!user_id) throw "No user id was provided";

        //let portfolio_items: any =  getDynamoQuery(process.env.DDB_TABLE_NAME, portfolio_id);

        return {
          statusCode: 200,
          body: JSON.stringify(user_id),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Get", JSON.stringify(err));
        return genericError(401, err);
    }
};