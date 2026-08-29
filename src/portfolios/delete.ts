import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils/utils";
import { getDynamoQuery, deleteDynamoItem, getDynamoItem, updateDynamoItem } from "./utils/dynamoConnector";
import { profile } from "console";

export const deletePortfolio = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const user_id = event.headers.authorization || event.headers.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_id = event.pathParameters?.portfolio_id;
        if (!portfolio_id) throw "No portfolio id was provided";
        if (portfolio_id.substr(0, portfolio_id.indexOf('~')) !== "portfolio") throw "The portfolio id is not correct";

        const portfolio_items =  await getDynamoQuery(process.env.DDB_TABLE_NAME, portfolio_id);

        let proms = [];
        for(let i=0; i<portfolio_items.Items.length; i++){
            proms.push(deleteDynamoItem(process.env.DDB_TABLE_NAME, portfolio_items.Items[i].hash_key, portfolio_items.Items[i].range_key));
        }
        proms.push(deleteDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, portfolio_id));
        
        await Promise.all(proms);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Succeded" }),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Delete", JSON.stringify(err));
        return genericError(401, err);
    }
};

export const deletePortfolioItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {        
        const user_id = event.headers.authorization || event.headers.Authorization;
        if (!user_id) throw "No user id was provided";

        const portfolio_id = event.pathParameters?.portfolio_id;
        if (!portfolio_id) throw "No portfolio id was provided";
        if (portfolio_id.substr(0, portfolio_id.indexOf('~')) !== "portfolio") throw "The portfolio id is not correct";


        const item_id = event.pathParameters?.item_id;
        if (!item_id) throw "No item id was provided";

        // Validate that the Portfolio exist and it is not deleted
        let portfolio = await getDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, portfolio_id);
        if (!portfolio || !portfolio.Item) throw `The portfolio ${portfolio_id} does not exist`;
        if (portfolio.Item.is_deleted) throw `The portfolio ${portfolio_id} is deleted. An item can't be added`;

        await deleteDynamoItem(process.env.DDB_TABLE_NAME, portfolio_id, item_id);

        // Update Portfolio
        const item_type = item_id.substr(0, item_id.indexOf('~')); 
        delete portfolio.Item.hash_key;
        delete portfolio.Item.range_key;
        portfolio.Item[`num_of_${item_type}s`]++;
        await updateDynamoItem(process.env.DDB_TABLE_NAME, `user~${user_id}`, portfolio.Item, portfolio_id);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Succeded" }),
          headers: corsHeaders,
        };
    } catch (err) {
        console.log("Portfolios - Delete", JSON.stringify(err));
        return genericError(401, err);
    }
};