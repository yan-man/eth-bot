const config = require("config");
const express = require("express");
const Web3 = require("web3");
const { ethers } = require("ethers");

// server config
const port = process.env.PORT || 3000;
const app = express();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// web3 config
const web3 = new Web3(config.get("RPC_URL"));

// eth contract setup
// Uniswap Factory Contract: https://etherscan.io/address/0xc0a47dfe034b400b47bdad5fecda2621de6c4d95#code
const UNISWAP_FACTORY_ABI = [
  {
    name: "getExchange",
    outputs: [{ type: "address", name: "out" }],
    inputs: [{ type: "address", name: "token" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 715,
  },
];
const UNISWAP_FACTORY_ADDR = "0xc0a47dfe034b400b47bdad5fecda2621de6c4d95";
const uniswapFactoryContract = new web3.eth.Contract(
  UNISWAP_FACTORY_ABI,
  UNISWAP_FACTORY_ADDR
);

UNISWAP_EXCHANGE_ABI = [
  {
    name: "TokenPurchase",
    inputs: [
      { type: "address", name: "buyer", indexed: true },
      { type: "uint256", name: "eth_sold", indexed: true },
      { type: "uint256", name: "tokens_bought", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "EthPurchase",
    inputs: [
      { type: "address", name: "buyer", indexed: true },
      { type: "uint256", name: "tokens_sold", indexed: true },
      { type: "uint256", name: "eth_bought", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "AddLiquidity",
    inputs: [
      { type: "address", name: "provider", indexed: true },
      { type: "uint256", name: "eth_amount", indexed: true },
      { type: "uint256", name: "token_amount", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "RemoveLiquidity",
    inputs: [
      { type: "address", name: "provider", indexed: true },
      { type: "uint256", name: "eth_amount", indexed: true },
      { type: "uint256", name: "token_amount", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "Transfer",
    inputs: [
      { type: "address", name: "_from", indexed: true },
      { type: "address", name: "_to", indexed: true },
      { type: "uint256", name: "_value", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "Approval",
    inputs: [
      { type: "address", name: "_owner", indexed: true },
      { type: "address", name: "_spender", indexed: true },
      { type: "uint256", name: "_value", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "setup",
    outputs: [],
    inputs: [{ type: "address", name: "token_addr" }],
    constant: false,
    payable: false,
    type: "function",
    gas: 175875,
  },
  {
    name: "addLiquidity",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "min_liquidity" },
      { type: "uint256", name: "max_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 82616,
  },
  {
    name: "removeLiquidity",
    outputs: [
      { type: "uint256", name: "out" },
      { type: "uint256", name: "out" },
    ],
    inputs: [
      { type: "uint256", name: "amount" },
      { type: "uint256", name: "min_eth" },
      { type: "uint256", name: "min_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 116814,
  },
  {
    name: "__default__",
    outputs: [],
    inputs: [],
    constant: false,
    payable: true,
    type: "function",
  },
  {
    name: "ethToTokenSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "min_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 12757,
  },
  {
    name: "ethToTokenTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "min_tokens" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 12965,
  },
  {
    name: "ethToTokenSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 50463,
  },
  {
    name: "ethToTokenTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 50671,
  },
  {
    name: "tokenToEthSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_eth" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 47503,
  },
  {
    name: "tokenToEthTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_eth" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 47712,
  },
  {
    name: "tokenToEthSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "eth_bought" },
      { type: "uint256", name: "max_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 50175,
  },
  {
    name: "tokenToEthTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "eth_bought" },
      { type: "uint256", name: "max_tokens" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 50384,
  },
  {
    name: "tokenToTokenSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 51007,
  },
  {
    name: "tokenToTokenTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 51098,
  },
  {
    name: "tokenToTokenSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 54928,
  },
  {
    name: "tokenToTokenTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 55019,
  },
  {
    name: "tokenToExchangeSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 49342,
  },
  {
    name: "tokenToExchangeTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 49532,
  },
  {
    name: "tokenToExchangeSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 53233,
  },
  {
    name: "tokenToExchangeTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 53423,
  },
  {
    name: "getEthToTokenInputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "eth_sold" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 5542,
  },
  {
    name: "getEthToTokenOutputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "tokens_bought" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 6872,
  },
  {
    name: "getTokenToEthInputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "tokens_sold" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 5637,
  },
  {
    name: "getTokenToEthOutputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "eth_bought" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 6897,
  },
  {
    name: "tokenAddress",
    outputs: [{ type: "address", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1413,
  },
  {
    name: "factoryAddress",
    outputs: [{ type: "address", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1443,
  },
  {
    name: "balanceOf",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "address", name: "_owner" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 1645,
  },
  {
    name: "transfer",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_to" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 75034,
  },
  {
    name: "transferFrom",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_from" },
      { type: "address", name: "_to" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 110907,
  },
  {
    name: "approve",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_spender" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 38769,
  },
  {
    name: "allowance",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "address", name: "_owner" },
      { type: "address", name: "_spender" },
    ],
    constant: true,
    payable: false,
    type: "function",
    gas: 1925,
  },
  {
    name: "name",
    outputs: [{ type: "bytes32", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1623,
  },
  {
    name: "symbol",
    outputs: [{ type: "bytes32", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1653,
  },
  {
    name: "decimals",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1683,
  },
  {
    name: "totalSupply",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1713,
  },
];

let isInProgress = false;
// bot implementation
const checkPrice = async () => {
  console.log("check price...");
  if (isInProgress) {
    return;
  }

  isInProgress = true;
  console.log("begin process...");
  try {
    // test first with DAI token vs ETH to make sure it is working properly
    const exchangeAddress = await uniswapFactoryContract.methods
      .getExchange("0x6b175474e89094c44da98b954eedeac495271d0f")
      .call();
    const exchangeContract = new web3.eth.Contract(
      UNISWAP_EXCHANGE_ABI,
      exchangeAddress
    );
    const uniswapRes = await exchangeContract.methods
      .getEthToTokenInputPrice(web3.utils.toWei("1", "ETHER"))
      .call();

    const val = web3.utils.fromWei(uniswapRes, "ether");
    console.log(val);
  } catch (error) {
    console.log(error);
  }
  success = 1;
  if (success) {
    clearInterval(monitor);
    // if success, clear the interval, clear progress flag
    isInProgress = false;
  }
};

// Query market prices every n sec
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 1000; // msec
monitor = setInterval(async () => {
  await checkPrice();
}, POLLING_INTERVAL);
