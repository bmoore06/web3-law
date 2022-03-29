const LawStorage = artifacts.require("LawStorage");

module.exports = function(deployer) {
  deployer.deploy(LawStorage);
};