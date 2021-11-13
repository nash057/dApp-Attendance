
var Classbook = artifacts.require("./Classbook.sol");

module.exports = function(deployer) {
  deployer.deploy(Classbook);
};