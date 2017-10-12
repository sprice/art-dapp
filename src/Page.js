import React, { Component } from 'react'
import DigitalArtWork from '../build/contracts/DigitalArtWork.json'
import getWeb3 from './utils/getWeb3'
import getNetwork from './utils/getNetwork'
import getContract from './utils/getContract'
import ChromecastButton from './ChromecastButton'

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
    this.destory = this.destory.bind(this)
    this.renderContract = this.renderContract.bind(this)
    this.renderNoContract = this.renderNoContract.bind(this)
    this.renderArtwork = this.renderArtwork.bind(this)

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
      transactions:[],
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
      const {name, id, etherscan} = network
      this.setState({
        networkName: name,
        networkId: id,
        etherscan
      })
      // Instantiate contract once web3 provided.
      return this.instantiateContract()
    })
    .then(() => {
      // @TODO: not sure if this is worth it. Will detect network change but it hits backend a ton.
      // setInterval(() => {
      //     if (this.state.web3) {
      //         getNetwork(this.state.web3).then((network) => {
      //             if (this.state.networkId !== network.id) {
      //               this.instantiateContract()
      //             }
      //             this.setState({
      //                 networkName: network.name,
      //                 networkId: network.id
      //             })
      //         })
      //     }
      // }, 100)
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
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      this.updateState()
    })
  }

  listForSale(evt) {
    evt.preventDefault()
    const value = this.state.newListingPrice
    const date = parseInt(new Date().getTime() / 1000, 10)
    this.state.instance.listWorkForSale(value, date, {from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      this.updateState()
    })
  }

  unlist(evt) {
    evt.preventDefault()
    this.state.instance.delistWorkForSale({from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
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
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      this.updateState()
    })
  }

  withdraw(evt) {
    evt.preventDefault()
    this.state.instance.withdraw({from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      this.updateState()
    })
  }

  destory(evt) {
    evt.preventDefault()
    this.state.instance.destroy({from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      this.updateState()
    })
  }

  updateListingAmount(event) {
    const ether = event.target.value
    const newListingPrice = this.state.web3.toWei(ether, 'ether');
    this.setState({newListingPrice})
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

  renderTransactions() {
    const etherscanBase = `${this.state.etherscan}tx/`
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.transactions && this.state.transactions.map((t, i) => {
              return (
                <tr key={i}>
                  <td><a href={etherscanBase + t} target="_blank">{t}</a></td>
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
      <h1>No artwork found on the {this.state.networkName} network.</h1>
    )
  }

  renderArtwork(isOwner) {
    const thumbnail = this.state.ipfsBase + this.state.artThumbHash
    const artwork = this.state.ipfsBase + this.state.artHash

    if (isOwner) {
        return <img src={thumbnail} alt={this.state.title} className="thumbnail" />
    } else {
      return <img src={artwork} alt={this.state.title} className="original" />
    }
  }

  renderContract() {

    const isArtist = this.state.account === this.state.artist
    const isOwner = this.state.account === this.state.owner
    const isContractOwner = this.state.account === this.state.contractOwner

    let saleAmount = ''
    if (this.state.web3) saleAmount = this.state.web3.fromWei(this.state.listingPrice, 'ether')

    let identity = ''
    if (isArtist) identity = 'You are the artist of this artwork'
    if (isOwner) identity = 'You are the owner of this artwork'
    if (isContractOwner) identity = 'You are the contract owner of this artwork'
    if (isArtist && isOwner) identity = 'You are the artist & owner of this artwork'
    if (isOwner && isContractOwner) identity = 'You are the contract owner & owner of this artwork'
    if (isArtist && isOwner && isContractOwner) identity = 'You are the contract owner & artist & owner of this artwork'

    return (
        <div>
          {identity && (
            <h4><em>{identity}</em> 😁</h4>
          )}
          {isOwner && (
            <ChromecastButton hash={this.state.artHash} />
          )}
          <h1>{this.state.title}</h1>
          <h2>{this.state.artistName}, {this.state.createdYear}</h2>
          <div className="description">
            <p></p>
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

          {isOwner && !this.state.forSale && this.state.artistHasSigned
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

    return (
      <div className="app">
        <div className="primary">
          <nav className="navbar pure-menu pure-menu-horizontal">
            <div className="">
              <a href="/" className="pure-menu-heading pure-menu-link">Chill</a>
            </div>
            <div className="">
              <a href="/about" className="pure-menu-heading pure-menu-link">About</a>
            </div>
          </nav>
          <div className="pure-g">
            <div className="pure-u-1-1">
                {this.state.contractLoaded
                  ? this.renderContract()
                  : this.renderNoContract()
                }
            </div>
            <div className="pure-u-1-1">
              {(this.state.transactions.length > 0) && this.renderTransactions()}
            </div>
            <div className="pure-u-1-1">
              {(this.state.provenence.length > 0) && this.renderProvenence()}
            </div>
          </div>
        </div>
        <div className="secondary">
          <div className="frame-wrap">
            {this.state.contractLoaded && (
              <div className="frame">
                  {this.renderArtwork()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default App
