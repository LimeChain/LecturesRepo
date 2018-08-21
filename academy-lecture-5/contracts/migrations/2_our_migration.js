let Billboard = artifacts.require("./Billboard.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Billboard);
};
