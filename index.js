const config = require("config");
const Web3 = require("web3");
const express = require("express");
const priceCRON = require("./priceCRON");

// server config
const port = config.get("PORT") || 3000;
const app = express();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// set polling interval
const pollingInterval = config.get("INTERVAL") || 1; // sec

// web3 config
const web3 = new Web3(config.get("RPC_URL"));

// initialize price check CRON job
const priceCheck = new priceCRON(web3);
priceCheck.start(pollingInterval);
