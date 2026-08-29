import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BSC_API_KEY, BSC_API_URL, fetch } from "./utils";
import { corsHeaders, genericError } from "./utils/utils";

const BSC_API_MODULE = "module=proxy";

export const getMostRecentBlockNumber = async (): Promise<APIGatewayProxyResult> => {
    try {
        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_blockNumber&${BSC_API_KEY}`, options);
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

export const getBlockByNumber = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tag = event.queryStringParameters?.tag;
        if (!tag) throw "No tag number was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getBlockByNumber&tag=${tag}&boolean=true&${BSC_API_KEY}`, options);
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

export const getBlockTrxCountByNumber = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tag = event.queryStringParameters?.tag;
        if (!tag) throw "No tag was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getBlockTransactionCountByNumber&tag=${tag}&${BSC_API_KEY}`, options);
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

export const getTrxByHash = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const hash = event.queryStringParameters?.hash;
        if (!hash) throw "No hash was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getTransactionByHash&txhash=${hash}&${BSC_API_KEY}`, options);
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

export const getTrxByBlocknoAndIndex = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tag = event.queryStringParameters?.tag;
        if (!tag) throw "No tag was provided in query string parameters";
        const index = event.queryStringParameters?.index;
        if (!index) throw "No tag was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getTransactionByBlockNumberAndIndex&tag=${tag}&index=${index}&${BSC_API_KEY}`, options);
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

export const getTrxCount = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getTransactionCount&address=${address}&tag=latest&${BSC_API_KEY}`, options);
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

export const getTrxReceipt = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const hash = event.queryStringParameters?.hash;
        if (!hash) throw "No hash was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getTransactionReceipt&txhash=${hash}&${BSC_API_KEY}`, options);
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

export const getSourceCode = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_getCode&address=${address}&tag=latest&${BSC_API_KEY}`, options);
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

export const getGasPrice = async (): Promise<APIGatewayProxyResult> => {
    try {
        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=eth_gasPrice&${BSC_API_KEY}`, options);
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