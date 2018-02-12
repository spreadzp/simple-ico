const FineToken = artifacts.require('./FineToken.sol');
const expectThrow = require('./helpers/expectThrow');
const should = require('./helpers/should');

const tokenParams = {
    name: 'FineToken',
    symbol: 'FTK',
    decimals: 18,
    initial_supply: 0
};

contract('FineToken', function ([_, investor, wallet, purchaser]) {

    beforeEach(async function () {
        this.token = await FineToken.new(tokenParams.name, tokenParams.symbol,
            tokenParams.decimals, tokenParams.initial_supply);
    });

    it('should start with correct params', async function () {

        const name = await this.token.name(),
            symbol = await this.token.symbol(),
            decimals = await this.token.decimals();

        assert.equal(name, tokenParams.name);
        assert.equal(symbol, tokenParams.symbol);
        assert.equal(decimals, tokenParams.decimals);
    });

    it('should mint a given amount of tokens to a given address', async function () {
        const result = await this.token.mint(investor, 100);

        assert.equal(result.logs[0].event, 'Mint');
        assert.equal(result.logs[0].args.to.valueOf(), investor);
        assert.equal(result.logs[0].args.amount.valueOf(), 100);
        assert.equal(result.logs[1].event, 'Transfer');
        assert.equal(result.logs[1].args.from.valueOf(), 0x0);

        let balance0 = await this.token.balanceOf(investor);
        assert.equal(balance0, 100);

        let totalSupply = await this.token.totalSupply();
        assert.equal(totalSupply, 100);
    });

});
