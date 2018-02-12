const FineToken = artifacts.require('./FineToken.sol');
const FineCrowdsale = artifacts.require('./FineCrowdsale.sol');
const expectThrow = require('./helpers/expectThrow');
const EVMRevert = require('./helpers/EVMRevert');
const should = require('./helpers/should');
const ether = require('./helpers/ether'); 

contract('FineCrowdsale', function ([_, contributor1, contributor2, contributor3, investor, hacker]) {

    before(async function () {
        this.contributors = [contributor1, contributor2, contributor3]; 
        this.token = await FineToken.deployed();
        this.crowdsale = await FineCrowdsale.new(this.token.address, this.contributors, { from: _ });
        const tokenInstance = await this.crowdsale.token();
        this.fineToken = await FineToken.at(tokenInstance);
        await this.fineToken.transferOwnership(this.crowdsale.address, { from: _ });
        const newOwner = await this.fineToken.owner(); 
    });

    it('should start with set correct params', async function () {
        const token = await this.crowdsale.token();
        const wallets0 = await this.crowdsale.contributors.call(0);
        assert.equal(this.fineToken.address, token);
        assert.equal(this.contributors[0], wallets0);
    });

    it('should owner token is the crowdsale contract', async function () {
        const newOwner = await this.fineToken.owner();
        assert.equal(this.crowdsale.address, newOwner);
    }); 

    it('should success invest to contract and get tokens', async function () {
        const ethersInvest = ether(3),
            expectedTokens = ethersInvest * 1000;

        const startBalance = await web3.eth.getBalance(this.crowdsale.address);
        startBalance.should.be.bignumber.equal(0);
        const { logs } = await this.crowdsale.invest({ from: this.contributors[0], value: ethersInvest });
        const event = logs.find(e => e.event === 'HaveInvest');
        event.args._investor.should.be.equal(this.contributors[0]);
        event.args._sumEther.should.be.bignumber.equal(ethersInvest);
        event.args._sumTokens.should.be.bignumber.equal(expectedTokens);
        const endBalance = await web3.eth.getBalance(this.crowdsale.address);
        endBalance.should.be.bignumber.equal(ethersInvest);
    });

    it('should success withdraw', async function () {
        const expectedEther = ether(1);

        const { logs } = await this.crowdsale.withdraw({ from: this.contributors[0] });
        const event = logs.find(e => e.event === 'WithdrawEther');
        event.args._contributor.should.be.equal(contributor1);
        event.args._sumWithdraw.should.be.bignumber.equal(expectedEther);
    });

    it('should reject withdraw when empty account ', async function () {
        await this.crowdsale.withdraw({ from: this.contributors[0] })
            .should.be.rejectedWith(EVMRevert);
    });

    it('should reject when another account init withdraw', async function () {
        await this.crowdsale.withdraw({ from: hacker })
            .should.be.rejectedWith(EVMRevert);
    });
});
