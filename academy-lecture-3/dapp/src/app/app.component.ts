declare var require: any;

import { Component } from '@angular/core';
import * as ethers from 'ethers';
const Billboard = require('contract-interfaces/Billboard.json');

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
  public jsonContent: string;
  public walletPassword: string;

  public infuraProvider: ethers.providers.InfuraProvider;
  public billboardContract: ethers.Contract;

  private infuraAPIKey = 'Up5uvBHSCSqtOmnlhL87';
  private billboardContractAddress = '0xA1C690A912b3fDEa65e0f2BAefb247D881EA5c9E';

  // etherlime deploy --secret=09d63a68dafa08dffee686e044f8dc4fe4fc368011d757edf68de4fe8af89f82 --network=ropsten
  // API key : Up5uvBHSCSqtOmnlhL87
  // 0xe42682eEa1DFC432C2fF5a779CD1D9a1e1c7f405 - Owner
  // 0x40cECa2f85bcA4De6f80D5a2a05396174e51c0E2 - Regular user
  // Metamask snippet https://gist.github.com/Perseverance/95d42cd7961bddc0f4644f196b4bbeff

  constructor() {
    this.infuraProvider = new ethers.providers.InfuraProvider(ethers.providers.networks.ropsten, this.infuraAPIKey);
    this.billboardContract = new ethers.Contract(this.billboardContractAddress, Billboard.abi, this.infuraProvider);
    this.billboardContract.slogan().then((slogan) => {
      this.billboardContent = slogan;
    });

    this.billboardContract.onlogbillboardbought = function (buyer, spent, newSlogan) {
      console.log(buyer, spent, newSlogan);
    };
  }

  public async getBillboardContent() {
    this.billboardContent = await this.billboardContract.slogan();
  }

  public async moneySpent() {
    const weiSpent = await this.billboardContract.moneySpent(this.address);
    alert(`${this.address} has spent ${weiSpent} wei`);
  }

  public async buyBillboard() {
    const wallet = await ethers.Wallet.fromEncryptedWallet(this.jsonContent, this.password);
    wallet.provider = this.infuraProvider;
    const connectedContract = this.billboardContract.connect(wallet);

    const transactionSentResult = await connectedContract.buy(this.newSlogan, {
      value: 650
    });

    await wallet.provider.waitForTransaction(transactionSentResult.hash);

    await this.getBillboardContent();

    alert('Billboard updated');
  }

  public async createWallet() {
    const wallet = await ethers.Wallet.createRandom();

    console.log(this.walletPassword);

    function callback(percent) {
      console.log('Encrypting: ' + parseInt(percent * 100) + '% complete');
    }

    const json = await wallet.encrypt(this.walletPassword, callback);
    console.log(json);

    window.localStorage.setItem('wallet', json);
  }
}

