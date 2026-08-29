import { APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders } from "./utils/utils";

const version = require("./version.json");

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(version),
    headers: corsHeaders,
  };
};
