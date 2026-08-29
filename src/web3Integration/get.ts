import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsHeaders, genericError } from "./utils";
const Web3 = require("web3");

// Get BNB Balance for a single Address (result value can change - implement timestamp logic)
export const walletBalanceByToken = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

  try {
    const walletAddress = event.queryStringParameters?.address;
    if (!walletAddress)
      throw "No address was provided in query string parameters";

    const tokenAddress = event.queryStringParameters?.token;
    if (!tokenAddress)
      throw "No contract was provided in query string parameters";

    // The minimum ABI to get ERC20 Token balance
    let minABI = [
      // balanceOf
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
      // decimals
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
      },
    ];

    // Get ERC20 Token contract instance
    // @ts-ignore
    let contract = new web3.eth.Contract(minABI, tokenAddress);

    // Call balanceOf function
    const balance = contract.methods.balanceOf(walletAddress).call();
    const decimals = contract.methods.decimals().call();

    const data = await Promise.all([balance, decimals]);
    let balanceOfWallet;

    try {
      balanceOfWallet = data[0] / 10 ** data[1];
    } catch {
      balanceOfWallet = 0;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        walletAddress: walletAddress,
        tokenAddress: tokenAddress,
        balanceOfWallet: balanceOfWallet,
      }),
      headers: corsHeaders,
    };
  } catch (e) {
    console.log("bscIntegration - getBalanceByAddress", e);
    return genericError(401, e);
  }
};

// Get BNB Balance for a single Address (result value can change - implement timestamp logic)
export const walletBalance = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

  try {
    const walletAddress = event.queryStringParameters?.address;
    if (!walletAddress)
      throw "No address was provided in query string parameters";

    // Get ERC20 Token contract instance
    // @ts-ignore
    let balance = new web3.eth.getBalance(walletAddress);

    const data = await Promise.all([balance]);
    let balanceOfWallet;

    try {
      balanceOfWallet = data[0] / 10 ** 18;
    } catch {
      balanceOfWallet = 0;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        walletAddress: walletAddress,
        balanceOfWallet: balanceOfWallet,
      }),
      headers: corsHeaders,
    };
  } catch (e) {
    console.log("bscIntegration - getBalance", e);
    return genericError(401, e);
  }
};

// Get transaction details from the node
export const transactionDetails = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

  try {
    const txHash = event.queryStringParameters?.txhash;
    if (!txHash)
      throw "No Hash was provided in query string parameters";

    const transaction = await web3.eth.getTransaction(txHash)

    if (!transaction)
    return genericError(403, {message: "Transaction not found"});

    return {
      statusCode: 200,
      body: JSON.stringify(transaction),
      headers: corsHeaders,
    };
  } catch (e) {
    console.log("web3Integration - transactionDetails", e);
    return genericError(401, e);
  }
};

// Get BNB Balance for a single Address (result value can change - implement timestamp logic)
export const pancakePoolBalance = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const Web3 = require("web3");
  const web3 = new Web3("https://bsc-dataseed1.binance.org:443");
  const poolAddress = "0xd4b293586cb74770749aea799e277241b339c62c";

  try {
    const poolAddress = event.queryStringParameters?.poolAddress;
    if (!poolAddress)
      throw "No address was provided in query string parameters";

    // The minimum ABI to get ERC20 Token balance
    let pool = {
      address: poolAddress,
      balance: 0.0,
      abi: [
        // balanceOff
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
        // firstToken
        {
          constant: true,
          inputs: [],
          name: "token0",
          outputs: [{ name: "", type: "address" }],
          type: "function",
        },
        // secondToken
        {
          constant: true,
          inputs: [],
          name: "token1",
          outputs: [{ name: "", type: "address" }],
          type: "function",
        },
        // decimals
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
        // decimals
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
        // TotalSupply
        {
          constant: true,
          inputs: [],
          name: "totalSupply",
          outputs: [{ name: "", type: "uint256" }],
          type: "function",
        },
      ],
    };

    let tokenABI = [
      // decimals
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
      },
      // balanceOf
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
      // name
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        type: "function",
      },
      // name
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        type: "function",
      },
    ];

    const token1 = {
      abi: tokenABI,
      address: "",
      decimals: 0,
      contract: "",
      balance: 0.0,
    };
    const token2 = {
      abi: tokenABI,
      address: "",
      decimals: 0,
      contract: "",
      balance: 0.0,
    };

    // Get ERC20 Token contract instance
    // @ts-ignore
    let poolContract = new web3.eth.Contract(pool.abi, pool.address);
    let poolToken1 = poolContract.methods.token0().call();
    let poolToken2 = poolContract.methods.token1().call();
    let totalSupply = poolContract.methods.totalSupply().call();

    [token1.address, token2.address, pool.balance] = await Promise.all([
      poolToken1,
      poolToken2,
      totalSupply,
    ]);

    token1.contract = new web3.eth.Contract(tokenABI, token1.address);
    token2.contract = new web3.eth.Contract(tokenABI, token2.address);

    // @ts-ignore
    const decimal1 = token1.contract.methods.decimals().call();
    // @ts-ignore
    const decimal2 = token2.contract.methods.decimals().call();
    // @ts-ignore
    const balance1 = token1.contract.methods.balanceOf(pool.address).call();
    // @ts-ignore
    const balance2 = token2.contract.methods.balanceOf(pool.address).call();

    [
      token1.decimals,
      token2.decimals,
      token1.balance,
      token2.balance,
    ] = await Promise.all([decimal1, decimal2, balance1, balance2]);

    try {
      token1.balance = token1.balance / 10 ** token1.decimals;
    } catch {
      token1.balance = 0;
    }

    try {
      token2.balance = token2.balance / 10 ** token2.decimals;
    } catch {
      token2.balance = 0;
    }

    try {
      pool.balance = pool.balance / 10 ** 18;
    } catch {
      pool.balance = 0;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        poolAddress: pool.address,
        token1: {
          address: token1.address,
          balance: token1.balance
        },
        token2: {
          address: token2.address,
          balance: token2.balance
        },
        LPBalance: pool.balance,
      }),
      headers: corsHeaders,
    };
  } catch (e) {
    console.log("bscIntegration - getBalanceByAddress", e);
    return genericError(401, e);
  }
};
