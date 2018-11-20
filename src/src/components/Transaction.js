import React, { Component } from 'react';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: null,
      userAddress: null,
      coins: '',
      paperCoinInstance: null
    };

    this.buyCoins = this.buyCoins.bind(this);
    this.sellCoins = this.sellCoins.bind(this);
    this.transact = this.transact.bind(this);
    this.setCoins = this.setCoins.bind(this);
  }

  setCoins(e) {
    this.setState({ coins: e.target.value });
  }

  transact(e) {
    if (this.props.cardTitle == 'BUY') {
      this.buyCoins();
    } else if (this.props.cardTitle == 'SELL') {
      this.sellCoins();
    }
  }

  async buyCoins() {
    let coins = this.state.coins;
    let receipt = await this.state.paperCoinInstance.transfer(
      this.state.userAddress,
      mulSafety(coins),
      {
        from: this.state.admin,
        gas: 100000
      }
    );

    let tokenBalance = await this.state.paperCoinInstance.balanceOf(
      this.state.userAddress
    );

    this.props.updateParent(divSafety(tokenBalance.valueOf()));
    console.log(receipt);
  }

  async sellCoins() {
    let coins = this.state.coins;
    let receipt = await this.state.paperCoinInstance.transfer(
      this.state.admin,
      mulSafety(coins),
      {
        from: this.state.userAddress,
        gas: 100000
      }
    );

    let tokenBalance = await this.state.paperCoinInstance.balanceOf(
      this.state.userAddress
    );

    this.props.updateParent(divSafety(tokenBalance.valueOf()));
    console.log(receipt);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      admin: nextProps.admin,
      userAddress: nextProps.userAddress,
      paperCoinInstance: nextProps.paperCoinInstance
    });
  }

  async componentDidMount() {}

  render() {
    return (
      <div className="card my-3 py-3">
        <div className="card-body">
          <h4 className="card-title py-2">
            {this.props.cardTitle} PAPER COINS
          </h4>
          <div className="form-group py-3">
            <input
              type="text"
              id="coinstobuy"
              className="form-control is-valid"
              placeholder="Enter number of coins"
              value={this.state.coins}
              onChange={this.setCoins}
            />
          </div>
          <a className={this.props.btnClass} href="#" onClick={this.transact}>
            {this.props.cardTitle}
          </a>
        </div>
      </div>
    );
  }
}

function mulSafety(a) {
  return a * 1e18;
}

function divSafety(a) {
  return a / 1e18;
}

export default Transaction;
