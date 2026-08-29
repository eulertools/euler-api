import { APIGatewayProxyResult } from "aws-lambda";
import { athenaExpress } from "./athenaClient";
import { corsHeaders, genericError } from "./utils/utils";

export const handler = async () : Promise<APIGatewayProxyResult> => {
    try{
        const query = "SELECT count(*) FROM transactions";
        const result = await athenaExpress.query(query);
        return { statusCode: 200, body: JSON.stringify(result.Items), headers: corsHeaders };
    } catch(e) {
        return genericError(401, e);
    }
}