// import {
//   APIGatewayProxyEvent,
//   APIGatewayProxyResult
// } from "aws-lambda";
// import { corsHeaders } from "./utils/utils";

// export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   try {
//     return {
//       statusCode: 200,
//       body: JSON.stringify(event),
//       headers: corsHeaders,
//     };
//   } catch (err) {
//     return {
//       statusCode: 200,
//       body: JSON.stringify(err),
//       headers: corsHeaders,
//     };
//   }
// };
