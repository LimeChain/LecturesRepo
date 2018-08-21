const etherlime = require('etherlime');

const Billboard = require('./../build/Billboard.json');
const BillToken = require('./../build/BillToken.json');

const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	deployer.gasLimit = 4700000;

	const billTokenWrapper = await deployer.deploy(BillToken, {}, "Billboard token", "BBT", 18);

	const mintTransaction = await billTokenWrapper.contract.mint('0x56a32fff5e5a8b40d6a21538579fb8922df5258c', '100000000000000000000');
	await billTokenWrapper.verboseWaitForTransaction(mintTransaction, 'Minting tokens to user');

	const mintTransaction2 = await billTokenWrapper.contract.mint('0xd9995bae12fee327256ffec1e3184d492bd94c31', '100000000000000000000');
	await billTokenWrapper.verboseWaitForTransaction(mintTransaction2, 'Minting tokens to user');

	const contractWrapper = await deployer.deploy(Billboard, {}, billTokenWrapper.contract.address);
	const setPriceTransaction = await contractWrapper.contract.setPrice(50);
	await contractWrapper.verboseWaitForTransaction(setPriceTransaction, "Initial setPrice");

	const approveTransaction = await billTokenWrapper.contract.approve(contractWrapper.contract.address, '1000000000000000000');
	await contractWrapper.verboseWaitForTransaction(approveTransaction, "Allow spending 1 token");

	const buyBillboard = await contractWrapper.contract.buy("Propy", '1000000000000000000');
	await contractWrapper.verboseWaitForTransaction(buyBillboard, "Buy billboard");

	const buyerBalance = await billTokenWrapper.contract.balanceOf('0xd9995bae12fee327256ffec1e3184d492bd94c31');
	console.log('Buyer Balance After:', buyerBalance.toString());

	const contractBalance = await billTokenWrapper.contract.balanceOf(contractWrapper.contract.address);
	console.log('Contract Balance After:', contractBalance.toString());

}

module.exports = {
	deploy
}
