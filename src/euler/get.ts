import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils/utils";
import { getTokenBySymbolQuery, getTokenByBscHashQuery, getTokenByEthHashQuery, listMainTokensQuery } from "./utils/dynamoConnector";

export const getTokenBySymbol = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const symbol = event.pathParameters?.symbol;
        if (!symbol) throw "No symbol was provided in query string parameters";

        const response = await getTokenBySymbolQuery(process.env.TOKEN_TABLE_NAME, symbol);

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Euler - getTokenBySymbol", JSON.stringify(err));
        return genericError(401, err);
    }
};

export const getTokenByBscHash = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const bsc_hash = event.pathParameters?.bsc;
        if (!bsc_hash) throw "No bsc hash was provided in query string parameters";

        const response = await getTokenByBscHashQuery(process.env.TOKEN_TABLE_NAME, bsc_hash);

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Euler - getTokenByBscHash", JSON.stringify(err));
        return genericError(401, err);
    }
};

export const getTokenByEthHash = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const eth_hash = event.pathParameters?.eth;
        if (!eth_hash) throw "No eth hash was provided in query string parameters";

        const response = await getTokenByEthHashQuery(process.env.TOKEN_TABLE_NAME, eth_hash);

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Euler - getTokenByEthHash", JSON.stringify(err));
        return genericError(401, err);
    }
};

export const listMainTokens = async (): Promise<APIGatewayProxyResult> => {
    try {        
        const response = await listMainTokensQuery(process.env.TOKEN_TABLE_NAME);

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Euler - getTokenByEthHash", JSON.stringify(err));
        return genericError(401, err);
    }
};