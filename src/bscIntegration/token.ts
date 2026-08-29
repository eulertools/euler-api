import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BSC_API_KEY, BSC_API_URL, fetch } from "./utils";
import { corsHeaders, genericError } from "./utils/utils";

const BSC_API_MODULE_STATS = "module=stats";
const BSC_API_MODULE_ACC = "module=account";

export const getSupplyByContractAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const contractAddress = event.queryStringParameters?.contractaddress;
        if (!contractAddress) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE_STATS}&action=tokensupply&contractaddress=${contractAddress}&${BSC_API_KEY}`, options);
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

export const getCirculatingSupplyByContractAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const contractAddress = event.queryStringParameters?.contractaddress;
        if (!contractAddress) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE_STATS}&action=tokenCsupply&contractaddress=${contractAddress}&${BSC_API_KEY}`, options);
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

export const getAccountBalanceByContractAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const contractaddress = event.queryStringParameters?.contractaddress;
        if (!contractaddress) throw "No contract address was provided in query string parameters";
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE_ACC}&action=tokenbalance&contractaddress=${contractaddress}&address=${address}&tag=latest&${BSC_API_KEY}`, options);
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