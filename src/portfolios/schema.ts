import { JsonSchemaType, JsonSchema } from "@aws-cdk/aws-apigateway";

const genericString: JsonSchema = {
    minLength: 1,
    type: JsonSchemaType.STRING,
    maxLength: 100,
};

const int: JsonSchema = {
    type: JsonSchemaType.INTEGER
} 

const bool: JsonSchema = {
    type: JsonSchemaType.BOOLEAN
} 

export const portfolioItemSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "name",
        "order",
        "identifier",
        "type"
    ],
    additionalProperties: false,
    properties: {
        name: genericString,
        order: int,
        identifier: genericString, // creste type to validate size and format
        type: genericString // create type to validate that the value is wallet or transaction or token
    },
}

export const portfolioSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "name"
    ],
    additionalProperties: false,
    properties: {
        name: genericString
    },
}