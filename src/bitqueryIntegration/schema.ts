import { JsonSchemaType, JsonSchema } from "@aws-cdk/aws-apigateway";

const genericString: JsonSchema = {
    minLength: 1,
    type: JsonSchemaType.STRING,
    maxLength: 100
};

const genericNumber: JsonSchema = {
    type: JsonSchemaType.INTEGER
};

export const tradesSchema: JsonSchema = { 
    type: JsonSchemaType.OBJECT,
    properties: {
        baseCurrency:genericString,
        quoteCurrency:genericString,
        since:genericString,
        till:genericString,
        window:genericNumber,
    },
    additionalProperties:false
}

export const symbolsListSchema: JsonSchema = { 
    type: JsonSchemaType.OBJECT,
    properties: {
        smartContractAddress:genericString,
        smartContractEvent:genericString,
        argument:genericString,
        desc:genericString,
        limit:genericNumber,
    },
    additionalProperties:false
}