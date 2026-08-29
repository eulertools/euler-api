import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BSC_API_KEY, BSC_API_URL, fetch } from "./utils";
import { corsHeaders, genericError } from "./utils/utils";

const BSC_API_MODULE = "module=block";

export const getUncleRewards = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const blockno = event.queryStringParameters?.blockno;
        if (!blockno) throw "No block number was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=getblockreward&blockno=${blockno}&${BSC_API_KEY}`, options);
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

export const getEstimatedCountdownTime = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const blockno = event.queryStringParameters?.blockno;
        if (!blockno) throw "No block number was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=getblockcountdown&blockno=${blockno}&${BSC_API_KEY}`, options);
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

export const getNumberByTimestamp = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const timestamp = event.queryStringParameters?.timestamp;
        if (!timestamp) throw "No timestamp was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=getblocknobytime&timestamp=${timestamp}&closes=before&${BSC_API_KEY}`, options);
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