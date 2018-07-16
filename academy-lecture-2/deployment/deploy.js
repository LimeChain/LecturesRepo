const etherlime = require('etherlime');

const Billboard = require('./../build/contracts/Billboard.json');

const deploy = async (network, secret) => {

	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, 'Up5uvBHSCSqtOmnlhL87');
	const contractWrapper = await deployer.deploy(Billboard);
	const setPriceTransaction = await contractWrapper.contract.setPrice(50);
	await contractWrapper.verboseWaitForTransaction(setPriceTransaction, "Initial setPrice");

}

module.exports = {
	deploy
}
