export interface QueryResponse<T> {
    Items: T[],
    ExclusiveStartKey?: ExclusiveStartKey
}

export interface GetResponse<T> {
    Item: T,
    ExclusiveStartKey?: ExclusiveStartKey
}

interface ExclusiveStartKey {
    hash_key: string,
    range_key: string
}

const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    maxRetries: 5,
    retryDelayOptions: {
        base: 300,
    },
});

// For keeping connection live between lambda and dynamo
const HttpsAgent = require('agentkeepalive').HttpsAgent;
AWS.config.httpOptions = { agent: new HttpsAgent() };

export var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-10-08" });

export const getDynamoDocument = async <T=any>(table_name: string|undefined, hash_key: string, range_key: string) => {
    const response: GetResponse<T> = await docClient.get({
        TableName: table_name,
        Key: { hash_key, range_key },
        FilterExpression: 'not is_deleted = :isDel',
		ExpressionAttributeValues: {
            ':isDel': true
		}
    }).promise()
    return response.Item;
}

export async function getDynamoQuery(table_name: string|undefined, hash_key: string) {
    return await docClient.query({
        TableName: table_name,
        KeyConditionExpression: 'hash_key = :hkey',
        FilterExpression: 'not is_deleted = :isDel',
        ExpressionAttributeValues: {
            ':hkey': hash_key,
            ':isDel': true
        },
    }).promise();
}

export async function getRkBegWithDynamoQuery(table_name: string|undefined, hash_key: string, range_key_prefix: string) {
    return await docClient.query({
        TableName: table_name,
        KeyConditionExpression: 'hash_key = :hkey and begins_with(range_key, :rkey)',
        FilterExpression: 'not is_deleted = :isDel',
        ExpressionAttributeValues: {
            ':hkey': hash_key,
            ':rkey': range_key_prefix,
            ':isDel': true
        },
    }).promise();
}

export async function getDynamoActiveItem(table_name: string|undefined, hash_key: string, range_key?:string) {
    return await docClient.get({
        TableName: table_name,
        Key: {
            hash_key: hash_key,
            range_key: range_key || "0"
        },
        FilterExpression: 'not is_deleted = :isDel',
		ExpressionAttributeValues: {
            ':isDel': true
		}
    }).promise();
}

export async function getDynamoItem(table_name: string|undefined, hash_key: string, range_key?:string) {
    return await docClient.get({
        TableName: table_name,
        Key: {
            hash_key: hash_key,
            range_key: range_key || "0"
        }
    }).promise();
}

export async function putDynamoItemCache(table_name: string|undefined, hash_key: string, item: any, range_key?:string) {
    item = {
        data: item,
        hash_key: hash_key,
        range_key: range_key || "0",
        update_date: Date.now()
    }
    return await docClient.put({
        TableName: table_name,
        Item: item,
    }).promise();
}

export async function putDynamoItem(table_name: string|undefined, item: any) {
    item = {
        ...item,
        update_date: Date.now()
    }
    return await docClient.put({
        TableName: table_name,
        Item: item,
    }).promise();
}

export async function deleteDynamoItem (table_name: string|undefined, hash_key: string, range_key: string) {
    const response = await docClient.update({
        TableName: table_name,
        Key: { hash_key: hash_key, range_key: range_key },
        UpdateExpression: 'set is_deleted = :del, update_date = :update_date',
        ExpressionAttributeValues: {
            ':del': true,
            ':update_date': Date.now(),
        },
        ReturnValues: "ALL_NEW",
    }).promise();
    return response.Attributes;
}

export async function updateDynamoItem(table_name: string|undefined, hash_key: string, data: any, range_key:string) {
    data = {
        ...data,
        update_date: Date.now()
    }
    return await docClient.update({
        TableName: table_name,
        Key: { hash_key: hash_key, range_key: range_key },
        Item: data,
        ReturnValues: "ALL_NEW",
    }).promise();
}

export async function listMainTokensQuery(table_name: string|undefined) {
    const response = await docClient.query({
        TableName: table_name,
        IndexName: 'main_tkn',
        KeyConditionExpression: 'gsi_main_tkn = :hkey',
        ExpressionAttributeValues: {
            ':hkey': "main_token",
        },
    }).promise();
    return response.Items;
}

export async function checkUnicity(table_name: string|undefined, id: string) {
    const query_result = await docClient.query({
        TableName: table_name,
        IndexName: 'gsi_unicity',
        KeyConditionExpression: 'gsi_unicity = :id',
        ExpressionAttributeValues: {
            ':id': id,
        },
    }).promise();

    const response = {
        exist: (query_result && query_result.Items && query_result.Items.length > 0) ? true : false,
        items: (query_result) ? query_result.Items : [] 
    }
    return response;
}

export async function getTokenBySymbolQuery(table_name: string|undefined, hash_key: string) {
    const response = await docClient.get({
        TableName: table_name,
        Key: { hash_key }
    }).promise();
    return response.Item;
}

export async function getTokenByBscHashQuery(table_name: string|undefined, hash_key: string) {
    const response = await docClient.query({
        TableName: table_name,
        IndexName: 'bsc_hash',
        KeyConditionExpression: 'gsi_bsc_hash = :hkey',
        ExpressionAttributeValues: {
            ':hkey': hash_key,
        },
    }).promise();
    return response.Items;
}

export async function getTokenByEthHashQuery(table_name: string|undefined, hash_key: string) {
    const response = await docClient.query({
        TableName: table_name,
        IndexName: 'ethereum_hash',
        KeyConditionExpression: 'gsi_eth_hash = :hkey',
        ExpressionAttributeValues: {
            ':hkey': hash_key,
        },
    }).promise();
    return response.Items;
}