pragma solidity ^0.4.24;

import './ERC20Basic.sol';
import './DSMath.sol';

contract PaperCoin is ERC20Basic {
    
    using DSMath for uint;
    uint constant WAD = 10 ** 18;
    
    address public admin;
    string public name;
    string public symbol;
    mapping (address => uint) internal balances;
    
    constructor(string _tokenName, string _tokenSymbol) public {
        admin = msg.sender;
        name = _tokenName;
        symbol = _tokenSymbol;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Unauthorized");
        _;
    }
    
    /** @dev Fix for the ERC20 short address attack. Checks if the payload size meets the minimum length
      * @param size length of the payload
      */
    modifier onlyPayloadSize(uint size) {
        if (msg.data.length < size + 4) {
            revert("Invalid Payload Size. Possible short address attack");
        }
        _;
    }
    
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
    
   function transfer(address _to, uint256 _amount) public onlyPayloadSize(2 * 32) returns(bool) {
       if(msg.sender == admin) {
           mint(_amount);
       }

       require(balances[msg.sender] >= _amount, 'Insufficient Funds');
       require(balances[_to].add(_amount) > balances[_to], 'Invalid Transaction');
       balances[msg.sender] = balances[msg.sender].sub(_amount);
       balances[_to] = balances[_to].add(_amount);
       emit Transfer(msg.sender, _to, _amount);
   }
   
   function transferFrom(address _from, address _to, uint _amount) external onlyPayloadSize(3 * 32) returns(bool) {
       require(balances[_from] >= _amount, 'Insufficient Funds');
       require(balances[_to].add(_amount) > balances[_to], 'Invalid Transaction');
       balances[_from] = balances[_from].sub(_amount);
       balances[_to] = balances[_to].add(_amount);
       emit Transfer(msg.sender, _to, _amount);
   }
   
   event TokenMinted(uint _tokens, uint _totalSupply);
   function mint(uint _tokens) public onlyAdmin {
       totalSupply = totalSupply.add(_tokens);
       balances[admin] = balances[admin].add(_tokens);
       emit TokenMinted(_tokens, totalSupply);
   }

   function() public payable {
   }
}


