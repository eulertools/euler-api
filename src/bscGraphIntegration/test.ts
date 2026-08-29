const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;


// pairs(first: 100, where: {createdAtBlockNumber_gte: 5188030}, orderBy: trackedReserveETH, orderDirection: desc) {
const SYMBOLS_PAIS_QUERY = gql`
    query pairs($kind: String) {
        pairs(first: 100, orderBy: txCount, orderDirection: desc) {
            id
        }
    }
`

async function main() {
    try {
        const graphqlData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange',
            method: 'post',
            data: {
              query: print(SYMBOLS_PAIS_QUERY),
              variables: { kind: ""}
            }
        });

    console.log(JSON.stringify(graphqlData.data))
    } catch (err) {
        console.log(JSON.stringify(err));
    }
};

main();