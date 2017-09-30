import React, { Component } from 'react'
import DigitalArtWork from '../build/contracts/DigitalArtWork.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.updateState = this.updateState.bind(this)
    this.sign = this.sign.bind(this)
    this.listForSale = this.listForSale.bind(this)
    this.unlist = this.unlist.bind(this)
    this.buy = this.buy.bind(this)
    this.withdraw = this.withdraw.bind(this)

    this.state = {
      web3: null,
      curator: '',
      owner: '',
      artThumbHash: '',
      artHash: '',
      listingPrice: 0,
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
      curatorCurrentBalance: 0
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const digitalArtWork = contract(DigitalArtWork)
    digitalArtWork.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      if (accounts[0]) this.setState({account: accounts[0]})
      digitalArtWork.deployed().then((instance) => {
      // digitalArtWork.at('0x0912279429798e39540fceb92434549ac3b4a4bc').then((instance) => {
        return this.setState({instance})
      }).then(() => {
        this.updateState()
      })
    })
  }

  updateState() {
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
                console.log(newState)
                this.setState(newState)
              }
            })
      }
    }
    // Called before for loop finishes
  }

  sign(evt) {
    evt.preventDefault()
    this.state.instance.signWork({from: this.state.account}).then((tx) => {
      this.updateState()
    })
  }

  listForSale(evt) {
    evt.preventDefault()
    const ether = 2
    const amount = parseInt(this.state.web3.toWei(ether, 'ether'), 10)
    const date = parseInt(new Date().getTime() / 1000, 10)
    this.state.instance.listWorkForSale(amount, date, {from: this.state.account}).then((tx) => {
      this.updateState()
    })
  }

  unlist(evt) {
    evt.preventDefault()
    this.state.instance.delistWorkForSale({from: this.state.account}).then((tx) => {
      this.updateState()
    })
  }

  buy(evt) {
    evt.preventDefault()
    const ether = 2
    const value = parseInt(this.state.web3.toWei(ether, 'ether'), 10)
    this.state.instance.buy({
      from: this.state.account,
      value
    }).then((tx) => {
      this.updateState()
    })
  }

  withdraw(evt) {
    evt.preventDefault()
    const ether = 0.3
    const value = this.state.web3.toWei(ether, 'ether');
    this.state.instance.withdraw(value, {from: this.state.account}).then((tx) => {
      this.updateState()
    })
  }

  render() {

    const thumbnail = this.state.ipfsBase + this.state.artThumbHash
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

    let saleAmount = ''
    if (this.state.web3) saleAmount = this.state.web3.fromWei(this.state.listingPrice, 'ether')

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
              </div>
              <div>
                <ul>
                  <li>Account: {this.state.account}</li>
                  <li>Owner: {this.state.owner}</li>
                  <li>Artist: {this.state.artist}</li>
                  <li>Curator: {this.state.curator}</li>
                </ul>
              </div>


              {isArtist && !this.state.artistHasSigned
                ? (
                  <div>
                    <span><a className="pure-button" onClick={this.sign}>Sign Art</a></span>
                  </div>
                  )
                : <span/>
              }

              {isOwner && !this.state.forSale
                ? (
                  <div>
                    <span><a className="pure-button" onClick={this.listForSale}>List for sale</a></span>
                  </div>
                  )
                : <span/>
              }

              {isOwner && this.state.forSale
                ? (
                  <div>
                    <span><a className="pure-button" onClick={this.unlist}>Unlist from sale</a></span>
                  </div>
                )
                : <span/>
              }

              {this.state.forSale && (!isArtist || !isOwner)
                ? (
                  <div>
                    <span><a className="pure-button" onClick={this.buy}>Buy</a></span>
                  </div>
                  )
                : <span/>
              }

              {isCurator
                ? (
                  <div>
                    <span><a className="pure-button" onClick={this.withdraw}>Withdraw</a></span>
                  </div>
                  )
                : <span/>
              }
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
