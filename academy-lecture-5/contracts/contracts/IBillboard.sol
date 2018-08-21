pragma solidity ^0.4.24;

contract IBillboard {
    
    event LogBillboardBought(address buyer, uint256 weiSpent, string newSlogan);

    function init(address billTokenContract) public;

    function buy(string inSlogan, uint256 tokens) public;
    
    function setPrice(uint256 newPrice) public;
    
    function historyLength() view public returns(uint256);

	function withdraw() public returns(bool);

    function getTokenAddress() public view returns(address);
    
    function getSlogan() public view returns(string);

    function upgradeImplementation(address _newImpl);

     
}