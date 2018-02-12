exports.BigNumber = web3.BigNumber;
exports.should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(this.BigNumber))
    .should();
