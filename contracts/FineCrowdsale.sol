pragma solidity 0.4.19; 

import "./../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./FineToken.sol";

/**
* @title FineCrowdsale
* @dev Simple crowdsale
*/
contract FineCrowdsale is Ownable {

    using SafeMath for uint256;

    FineToken public token;
    address[] public contributors; 

    /*
    * @dev multiplier ether with token
    */
    uint256 public rate;

    /*
    * @dev accounts of contributors 
    */
    mapping (address => uint256) accountsContributors;

    /*
    *  @dev Check address of the sender with addresses of contributors
    */
    modifier onlyContributor() { 
        bool canExec = false;
        for (uint256 i = 0; i < contributors.length; i++) {
            if (contributors[i] == msg.sender) {
                canExec = true;
            }
        }
        require(canExec);
        _;
    }

    event WithdrawEther(address _contributor, uint256 _sumWithdraw);
    event HaveInvest(address _investor, uint256 _sumEther, uint256 _sumTokens);

    /*
    *  @dev Check address of the sender with addresses of contributors
    */
    function FineCrowdsale(FineToken _token, address[] _contributors) public {
        contributors = _contributors;
        token = _token;    
        setStartAccounts(_contributors);
        rate = 1000; 
    }

    /*
    * @dev function can be used to buy tokens
    */
    function invest() public payable { 
        require(msg.value > 0);
        divideEther(msg.value);
        uint256 tokensForInvestor = msg.value.mul(rate);
        token.mint(msg.sender, tokensForInvestor);
        HaveInvest(msg.sender, msg.value, tokensForInvestor);
    }   
    
    /*
    * @dev function can be used to withdraw ether to own account
    */
    function withdraw() public onlyContributor {
        uint256 sumWithdraw = accountsContributors[msg.sender];  
        require(sumWithdraw > 0);
        accountsContributors[msg.sender] = 0;
        msg.sender.transfer(sumWithdraw); 
        WithdrawEther(msg.sender, sumWithdraw);
    }
    
    /*
    * @dev function set empty  accounts for contributors
    */
    function setStartAccounts(address[] _contributors) internal {
        for (uint256 i = 0; i < _contributors.length; i++) {
            accountsContributors[_contributors[i]] = 0;
        }
    } 
    
    /*
    * @dev function distribute invested ether between accounts of contributors
    */
    function divideEther(uint256 _etherFromInvestor) internal {       
        uint256 countContributors = contributors.length;
        uint256 partEther = _etherFromInvestor.div(countContributors);
        for (uint256 j = 0; j < countContributors; j++) {
            accountsContributors[contributors[j]] = accountsContributors[contributors[j]].add(partEther);
        } 
    } 
}
