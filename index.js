const config = require("config");
const express = require("express");

const port = config.get("PORT") || 3000;
const app = express();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const pollingInterval = config.get("INTERVAL") || 1000; // msec
const startPriceCRON = require("./priceCRON");
startPriceCRON(pollingInterval);
