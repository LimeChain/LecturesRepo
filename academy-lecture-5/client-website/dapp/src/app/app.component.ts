declare var require: any;

import { Component } from '@angular/core';
import * as ethers from 'ethers';
const Billboard = require('contract-interfaces/Billboard.json');
const BillToken = require('contract-interfaces/BillToken.json');

@Component({
  selector: 'dapp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public billboardContent: string = null;
  public address: string;
  public newSlogan: string;
  public password: string;
  public wallet: ethers.Wallet;

  public provider: ethers.providers.JsonRpcProvider;
  public billboardContract: ethers.Contract;
  public tokenContract: ethers.Contract;

  private infuraAPIKey = 'Up5uvBHSCSqtOmnlhL87';
  private billboardContractAddress = '0xEb4152Aa9a9730B89Bd61CAE8f960FF99FD0f86f';
  private tokenAddress = '0x09628ee377BC0D20F1D7917bC22074fB9c7385E7';

  // etherlime deploy --secret=09d63a68dafa08dffee686e044f8dc4fe4fc368011d757edf68de4fe8af89f82 --network=ropsten
  // API key : Up5uvBHSCSqtOmnlhL87
  // 0xe42682eEa1DFC432C2fF5a779CD1D9a1e1c7f405 - Owner
  // 0x40cECa2f85bcA4De6f80D5a2a05396174e51c0E2 - Regular user
  // Metamask snippet https://gist.github.com/Perseverance/95d42cd7961bddc0f4644f196b4bbeff

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545/');
    this.billboardContract = new ethers.Contract(this.billboardContractAddress, Billboard.abi, this.provider);
    this.billboardContract.slogan().then((slogan) => {
      this.billboardContent = slogan;
    });

    this.tokenContract = new ethers.Contract(this.tokenAddress, BillToken.abi, this.provider);

    this.billboardContract.onlogbillboardbought = function (buyer, spent, newSlogan) {
      console.log(buyer, spent, newSlogan);
    };

    this.wallet = new ethers.Wallet('0xf473040b1a83739a9c7cc1f5719fab0f5bf178f83314d98557c58aae1910e03a');
    this.wallet.provider = this.provider;
  }

  public async getBillboardContent() {
    this.billboardContent = await this.billboardContract.slogan();
  }

  public async moneySpent() {
    const weiSpent = await this.billboardContract.moneySpent(this.address);
    alert(`${this.address} has spent ${weiSpent} wei`);
  }

  public async buyBillboard() {
    const connectedContract = this.billboardContract.connect(this.wallet);
    const connectedToken = this.tokenContract.connect(this.wallet);

    let billboardContractBalance = await connectedToken.balanceOf(this.billboardContractAddress);

    console.log('Billboard balance before:', billboardContractBalance.toString());

    const allowContractResult = await connectedToken.approve(this.billboardContractAddress, '2000000000000000000');
    await this.wallet.provider.waitForTransaction(allowContractResult.hash);

    const transactionSentResult = await connectedContract.buy(this.newSlogan, '2000000000000000000');
    await this.wallet.provider.waitForTransaction(transactionSentResult.hash);

    await this.getBillboardContent();

    alert('Billboard updated');

    billboardContractBalance = await connectedToken.balanceOf(this.billboardContractAddress);
    console.log('Billboard balance after:', billboardContractBalance.toString());
  }

}

