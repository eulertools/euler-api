import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BSC_API_KEY, BSC_API_URL, fetch } from "./utils";
import { corsHeaders, genericError } from "./utils/utils";

const BSC_API_MODULE = "module=contract";

export const getContractAbiByAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=getabi&address=${address}&${BSC_API_KEY}`, options);
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

export const getContractSourceCodeByAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const addresses = event.queryStringParameters?.addresses;
        if (!addresses) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=getsourcecode&address=${addresses}&${BSC_API_KEY}`, options);
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