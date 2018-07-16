pragma solidity ^0.4.24;

contract Ownable {
    
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "This transaction was not sent by the owner");
        _;
    }
    
}

contract Billboard is Ownable {
    uint256 public price = 1 ether;
    address public billboardOwner;
    address[] public historyOfOwners;
    mapping(address => uint256) public moneySpent;
    string public slogan;
    
    event LogBillboardBought(address buyer, uint256 weiSpent, string newSlogan);
    
    modifier onlyPositive(uint256 newPrice) {
        require(newPrice > 0, "The price cannot be 0");
        _;
    }
    
    function buy(string inSlogan) public payable {
        require(msg.value >= price, "The ether sent was too low");
        billboardOwner = msg.sender;
        historyOfOwners.push(msg.sender);
        moneySpent[msg.sender] += msg.value;
        slogan = inSlogan;
        
        emit LogBillboardBought(msg.sender, msg.value, inSlogan);
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