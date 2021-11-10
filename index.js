require("dotenv").config();
const express = require("express");
const Web3 = require("web3");

const port = process.env.PORT || 3000;
const app = express();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// web3 config:
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// web3.eth.getAccounts(console.log);
let isInProgress = false;
let monitor;
// const abi;
// const testcontract = new web3.eth.Contract(abi, "0xfe724a829fdf12f7012365db98730eee33742ea2");

// https://ropsten.etherscan.io/token/0xad6d458402f60fd3bd25163575031acdce07538d
const dai_abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "INITIAL_SUPPLY",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_value", type: "uint256" }],
    name: "burn",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint256" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_burner", type: "address" },
      { indexed: false, name: "_value", type: "uint256" },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];
const dai_addr = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";
const exchangeContract = new web3.eth.Contract(dai_abi, dai_addr);

console.log(exchangeContract);

// const ETH_AMOUNT = web3.utils.toWei(".0001", "Ether");
// console.log("Eth Amount", ETH_AMOUNT);

const checkPrice = async () => {
  console.log("check price...");
  if (isInProgress) {
    return;
  }

  isInProgress = true;
  console.log("begin process...");
  // try {
  // } catch (error) {
  //   console.log(error);
  // }
  // try to find eth price
  // if it meets criteria, do some action
  success = 0;
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
