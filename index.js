const config = require("config");
const Web3 = require("web3");
const express = require("express");

const port = config.get("PORT") || 3000;
const app = express();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const pollingInterval = config.get("INTERVAL") || 1; // sec
const priceCRON = require("./priceCRON");
// priceCRON.startPriceCRON(pollingInterval);

// web3 config
const web3 = new Web3(config.get("RPC_URL"));

const priceCheck = new priceCRON(web3);

priceCheck.update(pollingInterval);
