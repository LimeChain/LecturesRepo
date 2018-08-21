pragma solidity ^0.4.24;

import './Upgradeability/UpgradeableImplementation.sol';
import './BillToken.sol';
import './IBillboard.sol';

contract BillboardImplementation is IBillboard, UpgradeableImplementation {

    address public owner;
    uint256 public price = 1 ether;
    address public billboardOwner;
    address[] public historyOfOwners;
    mapping(address => uint256) public moneySpent;
    string public slogan;
    BillToken tokenContract;
    
    function init(address billTokenContract) public {
        require(owner == address(0x0));
        tokenContract = BillToken(billTokenContract);
        slogan = "Ogi e Majstor!";
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyPositive(uint256 newPrice) {
        require(newPrice > 0, "The price cannot be 0");
        _;
    }

    function getTokenAddress() public view returns(address) {
        return tokenContract;
    }

    function getSlogan() public view returns(string) {
        return slogan;
    }
    
    function buy(string inSlogan, uint256 tokens) public {
        require(tokenContract.allowance(msg.sender, address(this)) >= tokens, "The token allowance was too low");
        require(tokens > price, "The tokens sent were too low");
        tokenContract.transferFrom(msg.sender, address(this), tokens);
        billboardOwner = msg.sender;
        historyOfOwners.push(msg.sender);
        moneySpent[msg.sender] += tokens;
        slogan = inSlogan;
        
        emit LogBillboardBought(msg.sender, tokens, inSlogan);
    }
    
    function setPrice(uint256 newPrice) public onlyOwner onlyPositive(newPrice) {
        price = newPrice;
    }
    
    function historyLength() view public returns(uint256) {
        return historyOfOwners.length;
    }

	function withdraw() public onlyOwner returns(bool) {
		owner.transfer(this.balance);
		return true;
	}
     
}