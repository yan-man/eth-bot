const cron = require("cron");
const { format } = require("date-fns");
const uniswap = require("./services/uniswap");
const Web3 = require("web3");
const config = require("config");

const UNISWAP_EXCHANGE_ABI = uniswap.UNISWAP_EXCHANGE_ABI;

// web3 config
const web3 = new Web3(config.get("RPC_URL"));

const uniswapFactoryContract = uniswap.getFactoryContract(web3);

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
    // use factory contract to get exchange address of the DAI:ETH swap
    const exchangeAddress = await uniswapFactoryContract.methods
      .getExchange("0x6b175474e89094c44da98b954eedeac495271d0f")
      .call();
    // get exchange contract
    const exchangeContract = new web3.eth.Contract(
      UNISWAP_EXCHANGE_ABI,
      exchangeAddress
    );
    // get price of token0:token1 based on exchange contract methods
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
    // clearInterval(monitor);
    // if success, clear the interval, clear progress flag
    isInProgress = false;
  }
};

function update(pollingInterval) {
  const CronJob = cron.CronJob;
  const job = new CronJob(
    `*/${pollingInterval / 1000} * * * * *`,
    function () {
      console.log(format(Date.now(), "MM/dd/yyyy H:ii:ss"));
      checkPrice();
    },
    null,
    true,
    "America/Chicago"
  );
  job.start();
}

module.exports = update;
