import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BSC_API_KEY, BSC_API_URL, fetch } from "./utils";
import { corsHeaders, genericError } from "./utils/utils";

const BSC_API_MODULE = "module=transaction";

export const checkReceiptStatus = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Note: status: 0 = Fail, 1 = Pass.
    try {
        const hash = event.queryStringParameters?.hash;
        if (!hash) throw "No hash was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=gettxreceiptstatus&txhash=${hash}&${BSC_API_KEY}`, options);
        result = await result.json();

        return {
            statusCode: 200, 
            body: JSON.stringify(result), 
            headers: corsHeaders,
        };
    } catch (e) {
        return genericError(401, e);
    }
}