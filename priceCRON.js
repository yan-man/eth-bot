const cron = require("cron");
const { format } = require("date-fns");
const uniswap = require("./services/uniswap");
class priceCRON {
  web3;
  isInProgress = false;
  #UNISWAP_EXCHANGE_ABI = uniswap.UNISWAP_EXCHANGE_ABI;
  #uniswapFactoryContract;

  constructor(web3) {
    this.web3 = web3;
    this.#uniswapFactoryContract = uniswap.getFactoryContract(web3);
  }

  update(pollingInterval) {
    const CronJob = cron.CronJob;
    const job = new CronJob(
      `*/${pollingInterval} * * * * *`,
      () => {
        this.checkPrice();
      },
      null,
      true,
      "America/Chicago"
    );
    job.start();
  }

  getPairPrice = async (args) => {
    const {
      token0Name,
      token0Address,
      token1Name,
      token1Address,
      token0Amount,
    } = {
      ...args,
    };

    const exchangeAddress = await this.#uniswapFactoryContract.methods
      .getExchange(token1Address)
      .call();

    const exchangeContract = new this.web3.eth.Contract(
      this.#UNISWAP_EXCHANGE_ABI,
      exchangeAddress
    );

    // get price of token0:token1 based on exchange contract methods
    const uniswapResult = await exchangeContract.methods
      .getEthToTokenInputPrice(token0Amount)
      .call();

    const token01price = this.web3.utils.fromWei(uniswapResult, "ETHER");

    const tableField = `UniswapV1 Conversion [${token1Name}:${token0Name}]`;
    const displayObject = {
      "Token 0": token0Name,
      "Token 1": token1Name,
      "Token0 Amount [ETH]": this.web3.utils.fromWei(token0Amount, "ETHER"),
    };
    displayObject[tableField] = token01price;
    displayObject["Timestamp"] = format(Date.now(), "MM/dd/yyyy H:ii:ss");
    console.table([displayObject]);
  };

  checkPrice = async () => {
    // bot implementation
    console.log("start process...");
    if (this.isInProgress) {
      return;
    }

    this.isInProgress = true;
    try {
      console.log("get pair price...");
      await this.getPairPrice({
        token0Name: "ETH",
        token0Address: "",
        token1Name: "DAI",
        token1Address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        token0Amount: this.web3.utils.toWei("1", "ETHER"),
      });
    } catch (error) {
      console.log(error);
    }
    // const success = 1;
    // if (success) {
    //   // if success, clear the interval, clear progress flag
    //   this.isInProgress = false;
    // }
  };
}

module.exports = priceCRON;
