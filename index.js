const config = require("config");
// require("dotenv").config();
const express = require("express");
// const Web3 = require("web3");
const { ethers } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool } = require("@uniswap/v3-sdk");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");

// const CoinGecko = require("coingecko-api");

const port = process.env.PORT || 3000;
const app = express();

const provider = new ethers.providers.JsonRpcProvider(config.get("RPC_URL"));

const dai = require("./services/dai");
const uniswap = require("./services/uniswap");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// const CoinGeckoClient = new CoinGecko();

const execut = (async () => {
  const uniswapContract = uniswap.getContract(provider);
  const daiContract = dai.getContract(provider);
})();

const poolAddress = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";
// const poolImmutablesAbi = [
//   "function factory() external view returns (address)",
//   "function token0() external view returns (address)",
//   "function token1() external view returns (address)",
//   "function fee() external view returns (uint24)",
//   "function tickSpacing() external view returns (int24)",
//   "function maxLiquidityPerTick() external view returns (uint128)",
// ];

const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  provider
);

async function getPoolImmutables() {
  const PoolImmutables = {
    factory: await poolContract.factory(),
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    fee: await poolContract.fee(),
    tickSpacing: await poolContract.tickSpacing(),
    maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
  };
  return PoolImmutables;
}

async function getPoolState() {
  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  const PoolState = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };

  return PoolState;
}

async function main() {
  const [immutables, state] = await Promise.all([
    getPoolImmutables(),
    getPoolState(),
  ]);

  const TokenA = new Token(3, immutables.token0, 6, "USDC", "USD Coin");

  const TokenB = new Token(3, immutables.token1, 18, "ETH", "Ether");

  const poolExample = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );

  const token0Price = poolExample.token0Price;
  const token1Price = poolExample.token1Price;

  // console.log(poolExample.sqrtRatioX96);
  // console.log(token0Price);
  // console.log(2 ** 192 / poolExample.sqrtPriceX96 ** 2);
}
// function token0Price() {
//   return (
//     this._token0Price ??
//     (this._token0Price = new Price(
//       this.token0,
//       this.token1,
//       Q192,
//       JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96)
//     ))
//   );
// }

// function token1Price() {
//   return (
//     this._token1Price ??
//     (this._token1Price = new Price(
//       this.token1,
//       this.token0,
//       JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96),
//       Q192
//     ))
//   );
// }

main().then((result) => {
  // console.log(result);
});

// const uniswapUsdcAddress = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc";
// const uniswapAbi = [
//   {
//     inputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "owner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "spender",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "sender",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount0",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount1",
//         type: "uint256",
//       },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//     ],
//     name: "Burn",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "sender",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount0",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount1",
//         type: "uint256",
//       },
//     ],
//     name: "Mint",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "sender",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount0In",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount1In",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount0Out",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount1Out",
//         type: "uint256",
//       },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//     ],
//     name: "Swap",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint112",
//         name: "reserve0",
//         type: "uint112",
//       },
//       {
//         indexed: false,
//         internalType: "uint112",
//         name: "reserve1",
//         type: "uint112",
//       },
//     ],
//     name: "Sync",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: "address", name: "from", type: "address" },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "DOMAIN_SEPARATOR",
//     outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "MINIMUM_LIQUIDITY",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "PERMIT_TYPEHASH",
//     outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "address", name: "", type: "address" },
//     ],
//     name: "allowance",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { internalType: "address", name: "spender", type: "address" },
//       { internalType: "uint256", name: "value", type: "uint256" },
//     ],
//     name: "approve",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ internalType: "address", name: "to", type: "address" }],
//     name: "burn",
//     outputs: [
//       { internalType: "uint256", name: "amount0", type: "uint256" },
//       { internalType: "uint256", name: "amount1", type: "uint256" },
//     ],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "factory",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "getReserves",
//     outputs: [
//       { internalType: "uint112", name: "_reserve0", type: "uint112" },
//       { internalType: "uint112", name: "_reserve1", type: "uint112" },
//       { internalType: "uint32", name: "_blockTimestampLast", type: "uint32" },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { internalType: "address", name: "_token0", type: "address" },
//       { internalType: "address", name: "_token1", type: "address" },
//     ],
//     name: "initialize",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "kLast",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ internalType: "address", name: "to", type: "address" }],
//     name: "mint",
//     outputs: [{ internalType: "uint256", name: "liquidity", type: "uint256" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [{ internalType: "string", name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "nonces",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { internalType: "address", name: "owner", type: "address" },
//       { internalType: "address", name: "spender", type: "address" },
//       { internalType: "uint256", name: "value", type: "uint256" },
//       { internalType: "uint256", name: "deadline", type: "uint256" },
//       { internalType: "uint8", name: "v", type: "uint8" },
//       { internalType: "bytes32", name: "r", type: "bytes32" },
//       { internalType: "bytes32", name: "s", type: "bytes32" },
//     ],
//     name: "permit",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "price0CumulativeLast",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "price1CumulativeLast",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ internalType: "address", name: "to", type: "address" }],
//     name: "skim",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { internalType: "uint256", name: "amount0Out", type: "uint256" },
//       { internalType: "uint256", name: "amount1Out", type: "uint256" },
//       { internalType: "address", name: "to", type: "address" },
//       { internalType: "bytes", name: "data", type: "bytes" },
//     ],
//     name: "swap",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [{ internalType: "string", name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "sync",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "token0",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "token1",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "totalSupply",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { internalType: "address", name: "to", type: "address" },
//       { internalType: "uint256", name: "value", type: "uint256" },
//     ],
//     name: "transfer",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { internalType: "address", name: "from", type: "address" },
//       { internalType: "address", name: "to", type: "address" },
//       { internalType: "uint256", name: "value", type: "uint256" },
//     ],
//     name: "transferFrom",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ]; // get the abi from https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc#code

// const getUniswapContract = async (address) =>
//   await new ethers.Contract(address, uniswapAbi, provider);

// const getEthUsdPrice = async () =>
//   await getUniswapContract(uniswapUsdcAddress)
//     .then((contract) => contract.getReserves())
//     .then(
//       (reserves) =>
//         (Number(reserves._reserve0) / Number(reserves._reserve1)) * 1e12
//     )
//     .then(console.log); // times 10^12 because usdc only has 6 decimals

// getEthUsdPrice();

// // web3 config:
// // const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://ropsten.infura.io/v3/5aa9a7d08657416a893bd35b2894e2d9"
//   )
// );
// // web3.eth.getAccounts(console.log);
// let isInProgress = false;
// let monitor;

// const uniswapContract = uniswap.getContract(web3);
// const daiContract = dai.getContract(web3);

// const ETH_AMOUNT = web3.utils.toWei(".0001", "Ether");
// console.log("Eth Amount", ETH_AMOUNT);

// const checkPrice = async () => {
//   console.log("check price...");
//   if (isInProgress) {
//     return;
//   }

//   isInProgress = true;
//   console.log("begin process...");
//   try {
//     const testval = await uniswapContract.methods;

//     console.log(testval);
//   } catch (error) {
//     console.log(error);
//   }
//   // try to find eth price
//   // if it meets criteria, do some action
//   success = 1;
//   if (success) {
//     clearInterval(monitor);
//     // if success, clear the interval, clear progress flag
//     isInProgress = false;
//   }
// };

// // Query market prices every n sec
// const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 1000; // msec
// monitor = setInterval(async () => {
//   await checkPrice();
// }, POLLING_INTERVAL);
