import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils/utils";
import { putDynamoItem } from "./utils/dynamoConnector";
import { FeedbackInput } from "./types";

export const sendFeedback = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const feedback_input = JSON.parse(event.body as string) as FeedbackInput;

        let feedback_to_save = {
            ...feedback_input,
            hash_key: "feedback",
            range_key: feedback_input.email
        }

        await putDynamoItem(process.env.DDB_TABLE_NAME, feedback_to_save);

        return {
          statusCode: 200,
          body: JSON.stringify(feedback_to_save),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Feedback - Send Feedback", JSON.stringify(err));
        return genericError(401, err);
    }
};