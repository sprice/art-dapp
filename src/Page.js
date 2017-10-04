import React, { Component } from 'react'
import DigitalArtWork from '../build/contracts/DigitalArtWork.json'
import getWeb3 from './utils/getWeb3'
import getNetwork from './utils/getNetwork'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    // const {id} = props.match.params

    this.updateState = this.updateState.bind(this)
    this.sign = this.sign.bind(this)
    this.listForSale = this.listForSale.bind(this)
    this.unlist = this.unlist.bind(this)
    this.buy = this.buy.bind(this)
    this.withdraw = this.withdraw.bind(this)
    this.updateListingAmount = this.updateListingAmount.bind(this)
    this.updateWithdrawalAmount = this.updateWithdrawalAmount.bind(this)
    this.destory = this.destory.bind(this)
    this.renderContract = this.renderContract.bind(this)
    this.renderNoContract = this.renderNoContract.bind(this)

    this.state = {
      web3: null,
      curator: '',
      owner: '',
      artThumbHash: '',
      artHash: '',
      listingPrice: 0,
      newListingPrice: 0,
      title: '',
      artistName: '',
      artist: '',
      createdYear: 0,
      forSaleDate: 0,
      forSale: false,
      artistHasSigned: false,
      ipfsBase: '//ipfs.io/ipfs/',
      account: null,
      instance: null,
      curatorCurrentBalance: 0,
      newWithdrawalAmount: 0,
      contractLoaded: false,
      networkName: '',
      networkId: 0
    }
  }

  componentWillMount() {
    // Listen for network change
    setInterval(() => {
        if (this.state.web3) {
            getNetwork(this.state.web3).then((network) => {
                this.setState({
                    networkName: network.name,
                    networkId: network.id
                })
            })
        }
    }, 100)

    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      return this.instantiateContract()
    })
    .then(() => {
      this.updateState()
    })
    .catch((err) => {
      console.error('Error', err)
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const digitalArtWork = contract(DigitalArtWork)
    digitalArtWork.setProvider(this.state.web3.currentProvider)

    
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (accounts[0]) this.setState({account: accounts[0]})
        digitalArtWork.deployed().then((instance) => {
          this.setState({contractLoaded: true})
        // digitalArtWork.at('0x0912279429798e39540fceb92434549ac3b4a4bc').then((instance) => {
          return this.setState({instance})
        }).then(() => {
          return resolve()
        }).catch((err) => {
          return resolve(err)
        })
      })
    })
  }

  updateState() {
    console.log('check')
    if (this.contractLoaded) {
        for (let i=0; i < DigitalArtWork.abi.length; i++) {
          let instance = DigitalArtWork.abi[i]
          let key = DigitalArtWork.abi[i].name
          if (instance.constant === true &&
              instance.inputs.length === 0 &&
              instance.payable === false &&
              instance.type === 'function') {
                this.state.instance[key].call().then((value) => {
                  let inState = this.state.hasOwnProperty(key)
                  if (inState) {
                    let isBigNumber = typeof value === 'object' && typeof value.toNumber === 'function'

                    let newState = {}

                    if (isBigNumber) newState[key] = value.toNumber()
                    else newState[key] = value
                    this.setState(newState)
                  }
                })
          }
        }
    }
    // Called before for loop finishes
  }

  sign(evt) {
    evt.preventDefault()
    this.state.instance.signWork({from: this.state.account}).then((tx) => {
      console.log('sign tx', tx)
      this.updateState()
    })
  }

  listForSale(evt) {
    evt.preventDefault()
    const value = this.state.newListingPrice
    const date = parseInt(new Date().getTime() / 1000, 10)
    this.state.instance.listWorkForSale(value, date, {from: this.state.account}).then((tx) => {
      console.log('listForSale tx', tx)
      this.updateState()
    })
  }

  unlist(evt) {
    evt.preventDefault()
    this.state.instance.delistWorkForSale({from: this.state.account}).then((tx) => {
      console.log('unlist tx', tx)
      this.updateState()
    })
  }

  buy(evt) {
    evt.preventDefault()
    const value = this.state.listingPrice
    this.state.instance.buy({
      from: this.state.account,
      value
    }).then((tx) => {
      console.log('buy tx', tx)
      this.updateState()
    })
  }

  withdraw(evt) {
    evt.preventDefault()
    const ether = 0.3
    const value = this.state.web3.toWei(ether, 'ether');
    this.state.instance.withdraw(value, {from: this.state.account}).then((tx) => {
      console.log('withdraw tx', tx)
      this.updateState()
    })
  }

  destory(evt) {
    evt.preventDefault()
    this.state.instance.destroy({from: this.state.account}).then((tx) => {
      console.log('destroy tx', tx)
      this.updateState()
    })
  }

  updateListingAmount(event) {
    const ether = event.target.value
    const newListingPrice = this.state.web3.toWei(ether, 'ether');
    this.setState({newListingPrice})
  }

  updateWithdrawalAmount(event) {
    const ether = event.target.value
    const newWithdrawalAmount = this.state.web3.toWei(ether, 'ether');
    this.setState({newWithdrawalAmount})
  }

  renderNoContract() {
    return (
      <h1>No contract found</h1>
    )
  }

  renderContract() {

    const thumbnail = this.state.ipfsBase + this.state.artThumbHash

    let saleAmount = ''
    if (this.state.web3) saleAmount = this.state.web3.fromWei(this.state.listingPrice, 'ether')

    return (
        <div>
          <h1>{this.state.title}</h1>
          <h4>{this.state.artistName}, {this.state.createdYear}</h4>
          <div>
            {this.state.artThumbHash
              ? <img src={thumbnail} alt={this.state.title} />
              : <span/>
            }
          </div>
          <div>
            <em>
              <div>The listing price is {saleAmount} ETH</div>
              <div>Sale Date {this.state.forSaleDate}</div>
              {this.state.forSale
                ? <span>This work is for sale: {saleAmount} ETH</span>
                : <span>This work is not for sale</span>
              }
            </em>
          </div>
          <div>
            <em>
              {this.state.artistHasSigned
                ? <span>This work is signed by the artist</span>
                : <span>This work has not yet been signed by the artist</span>
              }
            </em>
            <div>
              <ul>
                <li>Account: {this.state.account}</li>
                <li>Owner: {this.state.owner}</li>
                <li>Artist: {this.state.artist}</li>
                <li>Curator: {this.state.curator}</li>
              </ul>
            </div>
          </div>

          {/*{isArtist && !this.state.artistHasSigned
            ? (*/}
              <div>
                <span><a className="pure-button" onClick={this.sign}>Sign Art</a></span>
              </div>
              {/*)
            : <span/>
          }*/}

          {/*{isOwner && !this.state.forSale
            ? (*/}
              <div>
                <label htmlFor="listingAmount">Amount (ETH)</label>
                <input
                  id="listingAmount"
                  type="number"
                  placeholder="ETH"
                  onChange={this.updateListingAmount}
                />
                <span><a className="pure-button" onClick={this.listForSale}>List for sale</a></span>
              </div>
              {/*)
            : <span/>
          }*/}

          {/*{isOwner && this.state.forSale
            ? (*/}
              <div>
                <span><a className="pure-button" onClick={this.unlist}>Unlist from sale</a></span>
              </div>
            {/*)
            : <span/>
          }*/}

          {/*{this.state.forSale && (!isArtist || !isOwner)
            ? (*/}
              <div>
                <span><a className="pure-button" onClick={this.buy}>Buy</a></span>
                <span>{saleAmount} ETH</span>
              </div>
              {/*)
            : <span/>
          }*/}

          {/*{isCurator
            ? (*/}
              <div>
                <label htmlFor="withdrawalAmount">Amount (ETH)</label>
                <input
                  id="withdrawalAmount"
                  type="number"
                  placeholder="ETH"
                  onChange={this.updateWithdrawalAmount}
                />
                <span><a className="pure-button" onClick={this.withdraw}>Withdraw</a></span>
              </div>
              <div>
                <span><a className="pure-button" onClick={this.destory}>Destory</a></span>
              </div>
              {/*)
            : <span/>
          }*/}
        </div>
    );
  }

  render() {

    const isArtist = this.state.account === this.state.artist
    const isOwner = this.state.account === this.state.owner
    const isCurator = this.state.account === this.state.curator

    let identity = ''
    if (isArtist) identity = 'You are the artist'
    if (isOwner) identity = 'You are the owner'
    if (isCurator) identity = 'You are the curator'
    if (isArtist && isOwner) identity = 'You are the artist & owner'
    if (isOwner && isCurator) identity = 'You are the curator & owner'
    if (isArtist && isOwner && isCurator) identity = 'You are the curator & artist & owner'

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <div className="nav-column">
            <a href="#" className="pure-menu-heading pure-menu-link">Art Gallery</a>
          </div>
          <div className="pure-menu-heading nav-column personal">
            <span>{identity}</span>
          </div>
          <div className="pure-menu-heading  nav-column account">
            {this.state.account
              ? <span>Account: {this.state.account}</span>
              : <span>Please connect to <a href="https://metamask.io/" target="_blank">Metamask</a></span>
            }
          </div>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
                {this.state.contractLoaded
                  ? this.renderContract()
                  : this.renderNoContract()
                }
            </div>
          </div>
        </main>
        <footer>
          <div>Network: <span className="network-name">{this.state.networkName}</span></div>
        </footer>
      </div>
    )
  }
}

export default App
