const etherlime = require('etherlime');

const Billboard = require('./../build/contracts/Billboard.json');

const deploy = async (network, secret) => {

	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, 'Up5uvBHSCSqtOmnlhL87');
	const contractWrapper = await deployer.deploy(Billboard);
	const setPriceTransaction = await contractWrapper.contract.setPrice(50);
	await contractWrapper.verboseWaitForTransaction(setPriceTransaction, "Initial setPrice");
	const buyBillboard = await contractWrapper.contract.buy("Propy", {
		value: 1000
	});
	await contractWrapper.verboseWaitForTransaction(buyBillboard, "Buy billboard");

}

module.exports = {
	deploy
}
