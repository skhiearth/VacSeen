const VacSeen = artifacts.require("VacSeen");

// Deploy VacSeen contract
module.exports = function(deployer) {
  deployer.deploy(VacSeen);
};