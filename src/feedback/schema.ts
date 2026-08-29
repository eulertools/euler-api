import { JsonSchemaType, JsonSchema } from "@aws-cdk/aws-apigateway";

const genericString: JsonSchema = {
    minLength: 1,
    type: JsonSchemaType.STRING,
    maxLength: 100,
};

const longString: JsonSchema = {
    minLength: 1,
    type: JsonSchemaType.STRING,
    maxLength: 300,
};

export const feedbackSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "name",
        "email",
        "message"
    ],
    additionalProperties: false,
    properties: {
        name: genericString,
        email: genericString,
        message: longString
    },
}