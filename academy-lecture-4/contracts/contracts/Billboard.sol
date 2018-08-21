pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './BillToken.sol';

contract Billboard is Ownable {
    uint256 public price = 1 ether;
    address public billboardOwner;
    address[] public historyOfOwners;
    mapping(address => uint256) public moneySpent;
    string public slogan;
    BillToken tokenContract;
    
    event LogBillboardBought(address buyer, uint256 weiSpent, string newSlogan);

    constructor(address billTokenContract) public {
        tokenContract = BillToken(billTokenContract);
    }
    
    modifier onlyPositive(uint256 newPrice) {
        require(newPrice > 0, "The price cannot be 0");
        _;
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