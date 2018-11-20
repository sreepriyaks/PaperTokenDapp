import React, { Component } from 'react';
import Web3 from 'web3';
import '../css/style.css';
import Transaction from './Transaction';
import TruffleContract from 'truffle-contract';
import PaperCoin from '../truffle/build/contracts/PaperCoin.json';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: null,
      coins: 0,
      admin: null,
      userAddress: null,
      paperCoinInstance: null
    };
    this.web3Provider = new Web3.providers.HttpProvider(
      'http://localhost:8545'
    );

    this.web3 = new Web3(this.web3Provider);
    this.updateParent = this.updateParent.bind(this);
  }

  updateParent(e) {
    this.setState({ coins: e });
  }

  async componentDidMount() {
    this.web3.eth.getAccounts((err, res) => {
      this.setState({ admin: res[0], userAddress: res[1] });
    });

    this.paperCoin = TruffleContract(PaperCoin);
    this.paperCoin.setProvider(this.web3.currentProvider);
    this.paperCoin.deployed().then(async deployedPaperCoinInstance => {
      this.setState({ paperCoinInstance: deployedPaperCoinInstance });
      let tokenBalance = await deployedPaperCoinInstance.balanceOf(
        this.state.userAddress
      );

      this.setState({ coins: divSafety(tokenBalance.valueOf()) });
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-light bg-light mb-3">
          <div className="container">
            <a className="navbar-brand" href="#">
              PAPER COIN WALLET
            </a>
            <button
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarNav"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fas fa-home" />
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fas fa-sign-out-alt" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="jumbotron text-center">
            <h1 className="display-9">Hey {this.state.userName}!</h1>
            <hr />
            <p className="lead">
              You have
              <button className="btn btn-outline-info btn-rounded mx-3">
                {this.state.coins}
              </button>
              Paper Coins in your wallet!
            </p>
            <p className="lead">
              Your Blockchain Identity :{' '}
              <span className="btn btn-outline-info">
                {this.state.userAddress}
              </span>
            </p>
          </div>

          <div className="card-deck my-3">
            <Transaction
              cardTitle={'BUY'}
              btnClass={'btn btn-success btn-block'}
              paperCoinInstance={this.state.paperCoinInstance}
              admin={this.state.admin}
              userAddress={this.state.userAddress}
              updateParent={this.updateParent}
            />
            <Transaction
              cardTitle={'SELL'}
              btnClass={'btn btn-secondary btn-block'}
              paperCoinInstance={this.state.paperCoinInstance}
              admin={this.state.admin}
              userAddress={this.state.userAddress}
              updateParent={this.updateParent}
            />
          </div>
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

export default Header;
