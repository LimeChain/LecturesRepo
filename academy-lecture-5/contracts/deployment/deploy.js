const etherlime = require('etherlime');

const BillboardImplementation = require('./../build/BillboardImplementation.json');
const BillboardImplementation2 = require('./../build/BillboardImplementation2.json');
const BillToken = require('./../build/BillToken.json');
const BillboardProxy = require('./../build/BillboardProxy.json');
const IBillboard = require('./../build/IBillboard.json');
const IBillboard2 = require('./../build/IBillboard2.json');

const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	deployer.defaultOverrides = { gasLimit: 4700000 };

	const billTokenWrapper = await deployer.deploy(BillToken, {}, "Billboard token", "BBT", 18);

	const billboardImplementationWrapper = await deployer.deploy(BillboardImplementation);

	const billboardProxyWrapper = await deployer.deploy(BillboardProxy, {}, billboardImplementationWrapper.contractAddress);

	let upgradeableContractInstance = deployer.wrapDeployedContract(IBillboard, billboardProxyWrapper.contractAddress);

	const initTx = await upgradeableContractInstance.contract.init(billTokenWrapper.contractAddress);

	await upgradeableContractInstance.verboseWaitForTransaction(initTx, "Initialization transaction");

	const sloganBeforeUpdate = await upgradeableContractInstance.contract.getSlogan();

	console.log('Slogan before upgrade: ', sloganBeforeUpdate);

	const billboardImplementation2Wrapper = await deployer.deploy(BillboardImplementation2);

	const upgradeTx = await upgradeableContractInstance.contract.upgradeImplementation(billboardImplementation2Wrapper.contractAddress);

	await upgradeableContractInstance.verboseWaitForTransaction(upgradeTx, "Upgrading to second implementation");

	upgradeableContractInstance = deployer.wrapDeployedContract(IBillboard2, billboardProxyWrapper.contractAddress);

	const setTokenTx = await upgradeableContractInstance.contract.setTokenAddress('0x56a32fff5e5a8b40d6a21538579fb8922df5258c');

	await upgradeableContractInstance.verboseWaitForTransaction(setTokenTx, "Setting Token Address");

	const tokenAddress = await upgradeableContractInstance.contract.getTokenAddress();

	console.log('New token Address: ', tokenAddress);

	const sloganAfterUpdate = await upgradeableContractInstance.contract.getSlogan();

	console.log('Slogan after upgrade: ', sloganAfterUpdate);

	// const mintTransaction = await billTokenWrapper.contract.mint('0x56a32fff5e5a8b40d6a21538579fb8922df5258c', '100000000000000000000');
	// await billTokenWrapper.verboseWaitForTransaction(mintTransaction, 'Minting tokens to user');

	// const mintTransaction2 = await billTokenWrapper.contract.mint('0xd9995bae12fee327256ffec1e3184d492bd94c31', '100000000000000000000');
	// await billTokenWrapper.verboseWaitForTransaction(mintTransaction2, 'Minting tokens to user');

	// const setPriceTransaction = await contractWrapper.contract.setPrice(50);
	// await contractWrapper.verboseWaitForTransaction(setPriceTransaction, "Initial setPrice");

	// const approveTransaction = await billTokenWrapper.contract.approve(contractWrapper.contract.address, '1000000000000000000');
	// await contractWrapper.verboseWaitForTransaction(approveTransaction, "Allow spending 1 token");

	// const buyBillboard = await contractWrapper.contract.buy("Propy", '1000000000000000000');
	// await contractWrapper.verboseWaitForTransaction(buyBillboard, "Buy billboard");

	// const buyerBalance = await billTokenWrapper.contract.balanceOf('0xd9995bae12fee327256ffec1e3184d492bd94c31');
	// console.log('Buyer Balance After:', buyerBalance.toString());

	// const contractBalance = await billTokenWrapper.contract.balanceOf(contractWrapper.contract.address);
	// console.log('Contract Balance After:', contractBalance.toString());

}

module.exports = {
	deploy
}
