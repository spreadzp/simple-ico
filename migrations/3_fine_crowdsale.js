const FineToken = artifacts.require("./FineToken.sol");
const FineCrowdsale = artifacts.require("./FineCrowdsale.sol");

module.exports = function (deployer, network, accounts) {
  const contributors = [accounts[1], accounts[2], accounts[3]]; 
  deployer.deploy(FineCrowdsale, FineToken.address, contributors, 
    {gas: 99999999, from: accounts[0]});
};
