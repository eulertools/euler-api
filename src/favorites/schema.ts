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

export const favoriteSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  required: ['type', 'name'],
  additionalProperties: false,
  properties: {
    name: genericString,
    identifier: genericString, // creste type to validate size and format
    type: genericString, // create type to validate that the value is wallet or transaction or token
  },
};
