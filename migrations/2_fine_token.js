const FineToken = artifacts.require("./FineToken.sol");

module.exports = function (deployer, network, accounts) {
  const name = "FineToken"; // solium-disable-line uppercase
  const symbol = "FTK"; // solium-disable-line uppercase
  const decimals = 18; // solium-disable-line uppercase
  const initialSupply = 0;

  deployer.deploy(FineToken, name, symbol, decimals, initialSupply,
     { gas: 99999999, from: accounts[0] });
};
