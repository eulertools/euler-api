import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDynamoQuery, putDynamoItemCache } from './utils/dynamoConnector';
import { OHLC, GetTradesQueryArgs, GetSymbolsQueryArgs } from './types';
import { corsHeaders, genericError } from './utils/utils';
export const fetch = require('node-fetch');

const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

function compareCachedItems(a: any, b: any) {
  if (parseInt(a.range_key) > parseInt(b.range_key)) return 1;
  if (parseInt(b.range_key) > parseInt(a.range_key)) return -1;
  return 0;
}

const GET_TRADES = gql`
  query GetCandleData(
    $baseCurrency: String!
    $quoteCurrency: String!
    $since: ISO8601DateTime
    $till: ISO8601DateTime
    $window: Int
  ) {
    ethereum(network: bsc) {
      dexTrades(
        options: { limit: 10000, asc: "timeInterval.minute" }
        date: { since: $since, till: $till }
        exchangeAddress: { is: "0xbcfccbde45ce874adcb698cc183debcf17952812" }
        baseCurrency: { is: $baseCurrency }
        quoteCurrency: { is: $quoteCurrency }
      ) {
        timeInterval {
          minute(count: $window)
        }
        trades: count
        quotePrice
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: block, get: quote_price)
        close_price: maximum(of: block, get: quote_price)
      }
    }
  }
`;

function isOutdated(item: any): boolean {
  return item && item.update_date < Date.now() - 60 * 1000; // 1 min old
}

function cleanCachedResult(cachedResult: any[]) {
  let cleanResult: OHLC[] = [];

  cachedResult.forEach((element) => {
    cleanResult = [...cleanResult, ...element.data];
  });

  return cleanResult;
}

async function writeCache(hashKey: string, toSave: OHLC[]) {
  // TODO: IMPROVE PERFORMANCE BY PARALLELIZING
  let i,
    j,
    temparray,
    chunk = 100;
  let rangeKey = 0;
  for (i = 0, j = toSave.length; i < j; i += chunk) {
    temparray = toSave.slice(i, i + chunk);
    rangeKey++;
    await putDynamoItemCache(process.env.DDB_TABLE_NAME, hashKey, temparray, rangeKey.toString());
  }
}

function existDexTrades(data: any) {
  return data &&
    data.data &&
    data.data.data &&
    data.data.data.ethereum &&
    data.data.data.ethereum.dexTrades &&
    data.data.data.ethereum.dexTrades.length
    ? true
    : false;
}

export const getTrades = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const queryArgs = JSON.parse(event.body as string) as GetTradesQueryArgs;
    const symbol = event.queryStringParameters?.symbol;

    // Read Cache
    let hashKey = `bitqueryIntegration~${queryArgs.baseCurrency}~${queryArgs.quoteCurrency}`;
    if (symbol) hashKey += `~${symbol}`;
    let cachedResult: any = null; //await getDynamoQuery(process.env.DDB_TABLE_NAME, hashKey);

    let result: OHLC[] = [];

    let rate = 1.0;

    if (symbol == 'BUSD') {
      let result = await fetch('https://api.binance.com/api/v1/ticker/price?symbol=BNBUSDT');
      result = await result.json();
      rate = parseFloat(result.price);
    }

    if (!cachedResult.Items || cachedResult.Count === 0 || isOutdated(cachedResult.Items[0])) {
      const graphqlData = await axios({
        url: 'https://graphql.bitquery.io/',
        method: 'post',
        data: {
          query: print(GET_TRADES),
          variables: queryArgs,
        },
        headers: {
          'X-API-KEY': 'BQYvhnv04csZHaprIBZNwtpRiDIwEIW9',
        },
      });

      if (existDexTrades(graphqlData)) {
        const dexTrades = graphqlData.data.data.ethereum.dexTrades;
        let bars = dexTrades.map((el: any) => {
          return {
            time: Date.parse(el.timeInterval.minute),
            low: parseFloat(el.minimum_price) * rate,
            high: parseFloat(el.maximum_price) * rate,
            open: parseFloat(el.open_price) * rate,
            close: parseFloat(el.close_price) * rate,
            volume: el.trades,
          };
        });
        result = bars;

        // Write Cache
        await writeCache(hashKey, result);
      }
    } else {
      result = cleanCachedResult(cachedResult.Items.sort(compareCachedItems));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('bitqueryIntegration', JSON.stringify(err));
    return genericError(401, err);
  }
};

const GET_SYMBOLS = gql`
  query GetSymbolsList(
    $smartContractAddress: String!
    $smartContractEvent: String!
    $argument: String
    $desc: [String!]
    $limit: Int
  ) {
    ethereum(network: bsc) {
      arguments(
        smartContractAddress: { is: $smartContractAddress }
        smartContractEvent: { is: $smartContractEvent }
        argument: { is: $argument }
        options: { desc: $desc, limit: $limit }
      ) {
        block {
          height
        }
        argument {
          name
        }
        reference {
          address
          smartContract {
            currency {
              name
              symbol
            }
          }
        }
      }
    }
  }
`;

export const getSymbolsList = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const queryArgs = JSON.parse(event.body as string) as GetSymbolsQueryArgs;

    const graphqlData = await axios({
      url: 'https://graphql.bitquery.io/',
      method: 'post',
      data: {
        query: print(GET_SYMBOLS),
        variables: queryArgs,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(graphqlData.data),
      headers: corsHeaders,
    };
  } catch (err) {
    console.log('bitqueryIntegration', JSON.stringify(err));
    return genericError(401, err);
  }
};
