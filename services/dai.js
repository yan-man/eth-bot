const dai = require("../config/dai");

const getContract = (web3) => {
  const contract = new web3.eth.Contract(dai.abi, dai.addr);
  return contract;
};

module.exports = {
  getContract,
};
