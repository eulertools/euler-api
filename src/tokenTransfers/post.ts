import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { Client, Pool } from "pg";
import { corsHeaders } from "./utils/utils";

const pool = new Pool();

const client = new Client({
  user: "postgres",
  host: "bsc-blockchain.cluster-chngalmf84se.us-east-1.rds.amazonaws.com",
  database: "bsc_mainnet",
  password: "postgres",
  port: 5432,
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  client.connect();
  let query = "SELECT * FROM token_transfers WHERE token_address = $1 ORDER BY block_number DESC LIMIT $2 OFFSET $3"
  const address = event.queryStringParameters?.tokenAddress;
  const limit = event.queryStringParameters?.limit || 10;
  const offset = event.queryStringParameters?.offset || 0;
  const values = [address, limit, offset]
  try {
    const res = await client.query(query, values)
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
      headers: corsHeaders,
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify(err.stack),
      headers: corsHeaders,
    };
  }
};
