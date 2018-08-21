// const BigNumber = require('bignumber.js');

const Billboard = artifacts.require("./Billboard.sol");
const expectThrow = require('../util').expectThrow;
const timeTravel = require('../util').timeTravel;

contract('Billboard', function (accounts) {

	let productionContractInstance;

	const _owner = accounts[0];
	const _buyer = accounts[1];

	const weiInEther = 1000000000000000000;

	describe("Deploying Contract", () => {
		it("should deploy the contract correctly", async () => {
			const deployedContract = await Billboard.new({ from: _owner });
			const contractOwner = await deployedContract.owner();
			assert.strictEqual(contractOwner, _owner, "The owner was not the first account");
		})
	})

	describe("Buying billboard", () => {
		let billboardContract;
		beforeEach(async () => {
			billboardContract = await Billboard.new({ from: _owner });
		})

		it("should buy billboard correctly", async () => {
			const testSlogan = "Ogi e Maistor";
			const receipt = await billboardContract.buy(testSlogan, {
				from: _buyer,
				value: 1 * weiInEther
			});

			const testSloganInContract = await billboardContract.slogan();

			assert.strictEqual(testSloganInContract, testSlogan, "The slogans are different");
		})

		it("should throw on not enough money", async () => {
			await timeTravel(web3, 60);
			const testSlogan = "Ogi e Maistor";
			await expectThrow(billboardContract.buy(testSlogan, {
				from: _buyer,
				value: 0.5 * weiInEther
			}));
		})
	})



});