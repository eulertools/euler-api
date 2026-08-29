import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BSC_API_KEY, BSC_API_URL, fetch } from "./utils";
import { corsHeaders, genericError } from "./utils/utils";
import { getDynamoActiveItem, putDynamoItemCache } from "./utils/dynamoConnector";

const BSC_API_MODULE = "module=account";

function isOutdated(item: any): boolean {
    return (item && (item.update_date < (Date.now() - (60*1000)))); // 1 min old
}

function cleanCachedResult(cachedResult: any) {
    delete cachedResult.hash_key;
    delete cachedResult.range_key;
    delete cachedResult.update_date;
}

// Get BNB Balance for a single Address (result value can change - implement timestamp logic)
export const getBalanceByAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";

        // Read Cache
        const hashKey = `account~balance~${address}`;
        let cachedResult:any = await getDynamoActiveItem(process.env.DDB_TABLE_NAME, hashKey);

        let result;
        if (!cachedResult.Item || isOutdated(cachedResult.Item)) {
            const options = {
                method: "GET",
            };
    
            result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=balance&address=${address}&tag=latest&${BSC_API_KEY}`, options);
            result = await result.json();

            // Write Cache
            await putDynamoItemCache(process.env.DDB_TABLE_NAME, hashKey, result);
        } else {
            result = cleanCachedResult(cachedResult);            
        }
        
        return {
            statusCode: 200, 
            body: JSON.stringify(result), 
            headers: corsHeaders,
        };
    } catch (e) {
        console.log("bscIntegration - getBalanceByAddress", e);
        return genericError(401, e);
    }
}

// Get BNB Balance for multiple Addresses in a single call (NOT CACHED)
export const listBalances = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const addresses = event.queryStringParameters?.addresses;
        if (!addresses) throw "No address was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=balancemulti&address=${addresses}&tag=latest&${BSC_API_KEY}`, options);
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

// Get a list of 'Normal' Transactions By Address (NOT CACHED)
export const getNormalTransactionsByAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";
        const startBlock = event.queryStringParameters?.startblock;
        if (!startBlock) throw "No start block was provided in query string parameters";
        const endBlock = event.queryStringParameters?.endblock;
        if (!endBlock) throw "No end block was provided in query string parameters";

        const page = event.queryStringParameters?.page;
        const offset = event.queryStringParameters?.offset;

        let pagination = ""
        if (page && offset) {
            pagination = `&page=${page}&offset=${offset}`;
        }

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}${pagination}&sort=asc&${BSC_API_KEY}`, options);
        result = await result.json();

        let stringifiedBody = JSON.stringify(result)
		let responseIsTooBig = (stringifiedBody.length > 6000000)

        if (responseIsTooBig) {
            //paginar
        }

        return {
            statusCode: 200, 
            body: JSON.stringify(result), 
            headers: corsHeaders,
        };
    } catch (e) {
        return genericError(401, e);
    }
}

// Get a list of 'Internal' Transactions by Address (NOT CACHED)
export const getInternalTransactionsByAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.pathParameters?.address;
        if (!address) throw "No address was provided in query string parameters";
        const startBlock = event.queryStringParameters?.startblock;
        if (!startBlock) throw "No start block was provided in query string parameters";
        const endBlock = event.queryStringParameters?.endblock;
        if (!endBlock) throw "No end block was provided in query string parameters";
        
        const page = event.queryStringParameters?.page;
        const offset = event.queryStringParameters?.offset;

        let pagination = ""
        if (page && offset) {
            pagination = `&page=${page}&offset=${offset}`;
        }

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=txlistinternal&address=${address}&startblock=${startBlock}&endblock=${endBlock}${pagination}&sort=asc&${BSC_API_KEY}`, options);
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

// Get "Internal Transactions" by Transaction Hash (NOT CACHED)
export const getInternalTransactionsByHash = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const hash = event.pathParameters?.hash;
        if (!hash) throw "No hash was provided in query string parameters";

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=txlistinternal&hash=${hash}&${BSC_API_KEY}`, options);
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

// Get "Internal Transactions" by Block Range (NOT CACHED)
export const getInternalTransactionsByBlocks = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const startblock = event.queryStringParameters?.startblock;
        const endblock = event.queryStringParameters?.endblock;
        if (!startblock || ! endblock) throw "No block was provided in query string parameters";
        const page = event.queryStringParameters?.page || 1;
        const offset = event.queryStringParameters?.offset || 99999999;

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=txlistinternal&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=asc&${BSC_API_KEY}`, options);
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

// Get a list of "BEP-20 OR ERC721 - Token Transfer Events" by Address (NOT CACHED)
export const getTokenTransferEventsByAddress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tokens = ["BEP-20", "bep-20", "ERC721", "erc721"];
        const token = event.pathParameters?.token;
        if (!token || !tokens.includes(token)) throw "No valid token was provided";
        const address = event.pathParameters?.address;
        if (!address) throw "No address was provided";
        const page = event.queryStringParameters?.page;
        const offset = event.queryStringParameters?.offset;

        let subPath = ""
        if (page && offset) {
            subPath = `page=${page}&offset=${offset}`;
        } else {
            subPath = "startblock=1&endblock=25000000";
        }

        let action = ""
        if (token.toLowerCase() === "bep-20") {
            action = "tokentx";
        } else {
            action = "tokennftt";
        }

        const options = {
            method: "GET",
        };

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=${action}&address=${address}&${subPath}&sort=asc&${BSC_API_KEY}`, options);
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

// Get list of Blocks Validated by Address (NOT CACHED)
export const getTvalidatedBlocks = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const address = event.queryStringParameters?.address;
        if (!address) throw "No address was provided in query string parameters";
        const page = event.queryStringParameters?.page;
        const offset = event.queryStringParameters?.offset;

        const options = {
            method: "GET",
        };

        let paginate = "";
        if (page && offset) {
            paginate = `&page=${page}&offset=${offset}&`;
        }

        let result = await fetch(`${BSC_API_URL}?${BSC_API_MODULE}&action=getminedblock&address=${address}&blocktype=blocks${paginate}${BSC_API_KEY}`, options);
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