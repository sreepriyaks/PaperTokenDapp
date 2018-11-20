const PaperCoin = artifacts.require('PaperCoin');

module.exports = function(deployer, network, accounts) {
  let admin = accounts[0];

  deployer.deploy(PaperCoin, 'PaperCoin', 'Paper', {
    from: admin
  });
};
