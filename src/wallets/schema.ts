import { JsonSchemaType, JsonSchema } from '@aws-cdk/aws-apigateway';

const genericString: JsonSchema = {
  minLength: 1,
  type: JsonSchemaType.STRING,
  maxLength: 100,
};

const int: JsonSchema = {
  type: JsonSchemaType.INTEGER,
};

const bool: JsonSchema = {
  type: JsonSchemaType.BOOLEAN,
};

export const walletSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  required: ['name', 'address'],
  additionalProperties: true,
  properties: {
    name: genericString,
    address: genericString, // creste type to validate size and format
  },
};
