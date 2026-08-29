const awsCredentials = { 
    region: "us-east-1",
    accessKeyId: process.env.ATH_ACCESS_KEY_ID,
    secretAccessKey: process.env.ATH_SECRET_ACCESS_KEY
};

const aws = require("aws-sdk");
const AthenaExpress = require("athena-express");

aws.config.update(awsCredentials);

const athenaExpressConfig = { aws, db: "bscmainnet" };
export const athenaExpress = new AthenaExpress(athenaExpressConfig);