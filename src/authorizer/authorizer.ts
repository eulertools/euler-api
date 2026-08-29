import { APIGatewayRequestAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    const isAuthorized = await authorize(lowerCaseHeaders(event.headers || {}));
    if (!isAuthorized) return generatePolicy('Deny');
    return generatePolicy('Allow');
};

function lowerCaseHeaders(h:Headers|any):Headers {
    const keys = Object.keys(h);
    let n = keys.length;
    const res:Headers = {}
    while (n--) {
        const key = keys[n];
        res[key.toLowerCase()] = h[key];
    }
    return res;
}

type Headers = { [key:string]: string };

const authorize = async (headers: Headers): Promise<boolean> => {
    return (headers?.authorization || headers?.Authorization) ? true : false;
}

// Help function to generate an IAM policy
const generatePolicy = (effect: 'Allow'|'Deny'):APIGatewayAuthorizerResult => {
    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: "*"
            }]
        }
    };
}
