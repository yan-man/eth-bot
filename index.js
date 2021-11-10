require("dotenv").config();
const express = require("express");
// const Web3 = require("web3");

const port = process.env.PORT || 3000;
const app = express();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// web3 config:
// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// web3.eth.getAccounts(console.log);
let isInProgress = false;
let monitor;
// const abi;
// const testcontract = new web3.eth.Contract(abi, "0xfe724a829fdf12f7012365db98730eee33742ea2");

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
