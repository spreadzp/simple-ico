pragma solidity 0.4.19;

import "./../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

/**
 * @title FineToken token
 * @dev Simple ERC20 Token, with mintable token creation 
 * Based on code by OpenZeppelin: hhttps://github.com/OpenZeppelin/zeppelin-solidity/issues/120
 */
contract FineToken is MintableToken {
    string public name;// = "FineToken"; 
    string public symbol;// = "FTK"; 
    uint256 public decimals;// = 18; 
    uint256 public initialSupply;// = 0; //= 10000 * (10 ** uint256(decimals));
    
    // initial supply from params
    function FineToken(string _name, string _symbol, uint _decimals, uint256 _initialSupply) public { 
        name = _name;
        symbol = _symbol;
        decimals = _decimals; 
        initialSupply = _initialSupply;
    }
}
