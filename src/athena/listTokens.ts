import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { athenaExpress } from "./athenaClient";
import { corsHeaders, genericError } from "./utils/utils";

// const euler = {
//     address: "0x3920123482070c1a2dff73aad695c60e7c6f6862",
//     symbol: "EULER"
// }

export const handler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try{
        const limit = event.queryStringParameters?.limit;
        let query = "SELECT distinct(address), symbol FROM tokens";
        if (limit) query += ` LIMIT ${limit}`;
        const result = await athenaExpress.query(query);
        return { statusCode: 200, body: JSON.stringify(result.Items), headers: corsHeaders };
    } catch(e) {
        return genericError(401, e);
    }
}