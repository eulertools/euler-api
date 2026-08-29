import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { athenaExpress } from "./athenaClient";
import { corsHeaders, genericError } from "./utils/utils";

export const handler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try{
        const symbol = event.queryStringParameters?.symbol;
        if (!symbol) throw "Not symbol was provided";
        let query = `SELECT * FROM tokens WHERE symbol = '${symbol}'`;
        const result = await athenaExpress.query(query);
        return { statusCode: 200, body: JSON.stringify(result.Items), headers: corsHeaders };
    } catch(e) {
        return genericError(401, e);
    }
}