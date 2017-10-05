import React, { Component } from 'react'
import DigitalArtWork from '../build/contracts/DigitalArtWork.json'
import getWeb3 from './utils/getWeb3'
import getNetwork from './utils/getNetwork'
import getContract from './utils/getContract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.loadWeb3 = this.loadWeb3.bind(this)
    this.updateState = this.updateState.bind(this)
    this.setProvenence = this.setProvenence.bind(this)
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
      contractOwner: '',
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
      newWithdrawalAmount: 0,
      contractLoaded: false,
      networkName: '',
      networkId: 0,
      pageId: props.match.params.id,
      numSales: 0,
      provenence: [],
      emptyCellMarker: '-'
    }
  }

  componentWillMount() {
    this.loadWeb3()
  }

  loadWeb3() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      return getNetwork(this.state.web3)
    }).then((network) => {
      this.setState({
        networkName: network.name,
        networkId: network.id
      })
      // Instantiate contract once web3 provided.
      return this.instantiateContract()
    })
    .then(() => {
      setInterval(() => {
          if (this.state.web3) {
              getNetwork(this.state.web3).then((network) => {
                  if (this.state.networkId !== network.id) {
                    this.instantiateContract()
                  }
                  this.setState({
                      networkName: network.name,
                      networkId: network.id
                  })
              })
          }
      }, 100)
    })
    .catch((err) => {
      console.log('Error', err)
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const digitalArtWork = contract(DigitalArtWork)
    digitalArtWork.setProvider(this.state.web3.currentProvider)

    
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (accounts[0]) this.setState({account: accounts[0]})
        const contractId = getContract(this.state.networkName, this.state.pageId)
        if (contractId) {
          digitalArtWork.at(contractId).then((instance) => {
            this.setState({
              instance,
              contractLoaded: true
            })
            this.updateState()
            return resolve()
          }).catch((err) => {
            this.setState({
              contractLoaded: false
            })
            return reject(err)
          })
        } else {
          this.setState({
            contractLoaded: false
          })
          return resolve()
        }
      })
    })
  }

  updateState() {
    this.setState({contractLoaded: true})
    for (let i = 0; i < DigitalArtWork.abi.length; i++) {
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
      if (instance.name === 'getSalesNum') {
        this.state.instance[key].call().then((value) => {
          const provenenceLength = value.toNumber()
          let provenence = []
          for (let i = 0; i < provenenceLength; i++) {
            this.state.instance['provenence'].call(i).then((value) => {
              provenence.push({
                address: value[0],
                amount: value[1].toNumber(),
                date: value[2].toNumber()
              })
              if (i === (provenenceLength - 1)) this.setProvenence(provenence)
            })
          }
        })
      }
    }
  }

  setProvenence(provenence) {
    if (provenence.length) this.setState({provenence})
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
    this.state.instance.withdraw({from: this.state.account}).then((tx) => {
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

  renderProvenence() {
    return (
      <div>
        <h4>Provenence</h4>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {this.state.provenence && this.state.provenence.map((p, i) => {
              return (
                <tr key={i}>
                  <td>{new Date(p.date * 1000).toDateString()}</td>
                  <td>{this.state.web3.fromWei(p.amount, 'ether')} ETH</td>
                  <td>{p.address}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  renderNoContract() {
    return (
      <h1>No contract found</h1>
    )
  }

  renderContract() {

    const isArtist = this.state.account === this.state.artist
    const isOwner = this.state.account === this.state.owner
    const isContractOwner = this.state.account === this.state.contractOwner

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
                <label htmlFor="listingAmount">Amount (ETH)</label>
                <input
                  id="listingAmount"
                  type="number"
                  placeholder="ETH"
                  onChange={this.updateListingAmount}
                />
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
                <span>{saleAmount} ETH</span>
              </div>
              )
            : <span/>
          }

          {isContractOwner
            ? (
              <div>
                <div>
                  <span><a className="pure-button" onClick={this.withdraw}>Withdraw</a></span>
                </div>
                <div>
                  <span><a className="pure-button" onClick={this.destory}>Destory</a></span>
                </div>
              </div>
              )
            : <span/>
          }
        </div>
    );
  }

  render() {

    const isArtist = this.state.account === this.state.artist
    const isOwner = this.state.account === this.state.owner
    const isContractOwner = this.state.account === this.state.contractOwner

    let identity = ''
    if (isArtist) identity = 'You are the artist'
    if (isOwner) identity = 'You are the owner'
    if (isContractOwner) identity = 'You are the contract owner'
    if (isArtist && isOwner) identity = 'You are the artist & owner'
    if (isOwner && isContractOwner) identity = 'You are the contract owner & owner'
    if (isArtist && isOwner && isContractOwner) identity = 'You are the contract owner & artist & owner'

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
          <div>
            <div className="pure-u-1-1">
                {this.state.contractLoaded
                  ? this.renderContract()
                  : this.renderNoContract()
                }
            </div>
            <div>
              {(this.state.provenence.length > 0) && this.renderProvenence()}
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default App
