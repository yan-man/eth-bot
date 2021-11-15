require("dotenv").config();
const express = require("express");
const Web3 = require("web3");

const port = process.env.PORT || 3000;
const app = express();

// const Dai = require("./config/dai");
const dai = require("./services/dai");
const uniswap = require("./services/dai");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// web3 config:
// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/5aa9a7d08657416a893bd35b2894e2d9"
  )
);
// web3.eth.getAccounts(console.log);
let isInProgress = false;
let monitor;

const uniswapContract = uniswap.getContract(web3);
const daiContract = dai.getContract(web3);

const ETH_AMOUNT = web3.utils.toWei(".0001", "Ether");
console.log("Eth Amount", ETH_AMOUNT);

const checkPrice = async () => {
  console.log("check price...");
  if (isInProgress) {
    return;
  }

  isInProgress = true;
  console.log("begin process...");
  try {
    const testval = await uniswapContract.methods;

    console.log(testval);
  } catch (error) {
    console.log(error);
  }
  // try to find eth price
  // if it meets criteria, do some action
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
