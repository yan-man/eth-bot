const uniswap = require("../config/uniswap");

const getContract = (web3) => {
  // https://ropsten.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D#code
  const contract = new web3.eth.Contract(uniswap.abi, uniswap.addr);
  return contract;
};

module.exports = {
  getContract,
};
