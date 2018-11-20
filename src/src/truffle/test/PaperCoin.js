const PaperCoin = artifacts.require('PaperCoin');

contract('PaperCoin', accounts => {
  let admin = accounts[0];

  it('Check Token Admin', async () => {
    let PaperCoinInstance = await PaperCoin.deployed();
    let tokenAdmin = await PaperCoinInstance.admin.call();
    assert.equal(admin, tokenAdmin, 'Invalid Admin Set');
  });

  it('Transfer Coins', async () => {
    let PaperCoinInstance = await PaperCoin.deployed();
    let receipt = await PaperCoinInstance.transfer(accounts[1], mulSafety(10), {
      from: admin
    });

    let totalSupply = await PaperCoinInstance.totalSupply();
    let userTokens = await PaperCoinInstance.balanceOf(accounts[1]);

    assert.equal(
      divSafety(totalSupply.valueOf()),
      10,
      'Incorrect No. Of Tokens Minted'
    );
    assert.equal(
      divSafety(userTokens.valueOf()),
      10,
      'Incorrect token transfer'
    );

    receipt = await PaperCoinInstance.transfer(admin, mulSafety(10), {
      from: accounts[1]
    });

    console.log(receipt);
  });
});

function mulSafety(a) {
  return a * 1e18;
}

function divSafety(a) {
  return a / 1e18;
}
