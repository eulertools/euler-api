

// const fetch = require('node-fetch');

// const AWS = require('aws-sdk');

// AWS.config.update({
// 	accessKeyId: [accessKeyId],
// 	secretAccessKey: [secretAccessKey],
// 	region: "us-east-1",
//     maxRetries: 5,
//     retryDelayOptions: {
//         base: 300
//     }
// })

// // For keeping connection live between lambda and dynamo
// const HttpsAgent = require('agentkeepalive').HttpsAgent;
// AWS.config.httpOptions = { agent: new HttpsAgent() };

// var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-10-08" });

// async function putDynamoItem(table_name: any, item: any) {
//     item = {
//         ...item,
//         update_date: Date.now()
//     }
//     return await docClient.put({
//         TableName: table_name,
//         Item: item,
//     }).promise();
// }

// async function save(remain:string[]) {
//     let retry = [];
//     let proms = [];
//     let j = 0;
//     for(let i=0; i<remain.length; i++){
//         console.log(i, remain[i]);
//         let coin_data
//         try {
//             coin_data = await fetch(`https://api.coingecko.com/api/v3/coins/${remain[i]}?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`);
//             coin_data = await coin_data.json();
//             const item = {
//                 hash_key: coin_data.symbol,
//                 symbol: coin_data.symbol,
//                 name: coin_data.name,
//                 gsi_bsc_hash: (coin_data.platforms["ethereum"] !== "") ? coin_data.platforms["ethereum"] : undefined,
//                 gsi_eth_hash: (coin_data.platforms["binance-smart-chain"] !== "") ? coin_data.platforms["binance-smart-chain"] : undefined,
//                 block_time_in_minutes: coin_data.block_time_in_minutes,
//                 hashing_algorithm: coin_data.hashing_algorithm,
//                 categories: coin_data.categories,
//                 localization: coin_data.localization,
//                 public_notice: coin_data.public_notice,
//                 additional_notices: coin_data.additional_notices,
//                 description: coin_data.description,
//                 links: coin_data.links,
//                 blockchain_site: coin_data.blockchain_site,
//                 official_forum_url: coin_data.official_forum_url,
//                 chat_url: coin_data.chat_url,
//                 announcement_url: coin_data.announcement_url,
//                 twitter_screen_name: coin_data.twitter_screen_name,
//                 facebook_username: coin_data.facebook_username,
//                 bitcointalk_thread_identifier: coin_data.bitcointalk_thread_identifier,
//                 telegram_channel_identifier: coin_data.telegram_channel_identifier,
//                 subreddit_url: coin_data.subreddit_url,
//                 repos_url: coin_data.repos_url,
//                 //image: image,
//                 country_origin: coin_data.country_origin,
//                 genesis_date: coin_data.genesis_date
//             }    
//             proms.push(putDynamoItem("euler-tokens-table", item));
//             j = i;
//         } catch(e) {
//             console.log(JSON.stringify(remain[i]));
//             retry.push(remain[i]);
//             console.log("Error", e);
//             continue;
//         }        
//     }

//     console.log("Promises:", j);
//     await Promise.all(proms);
//     if (retry.length > 0) save(retry);
// }

// async function main(){
//     try {       
//         console.log("Start")
//         let coins = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=true');
//         coins = await coins.json();
//         console.log("Coins:", coins.length);
//         let remain = coins.map((c:any) => {
//             return c.id;
//         });

//         save(remain);
//         console.log("END")
//     } catch (err) {
//         console.log("Euler - migrateCgData", JSON.stringify(err));
//     }
// };

// main();