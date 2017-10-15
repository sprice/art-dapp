import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import Loader from 'react-loader'
import moment from 'moment'
import ArtGallery from '../build/contracts/ArtGallery.json'
import getWeb3 from './utils/getWeb3'
import getNetwork from './utils/getNetwork'
import getArtworkContract from './utils/getArtworkContract'
import ChromecastButton from './ChromecastButton'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/react-datepicker.css'

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
    this.updateForSaleDate = this.updateForSaleDate.bind(this)
    this.destory = this.destory.bind(this)
    this.renderContract = this.renderContract.bind(this)
    this.renderNoContract = this.renderNoContract.bind(this)
    this.renderArtwork = this.renderArtwork.bind(this)
    this.renderEdition = this.renderEdition.bind(this)
    this.renderChooseEdition = this.renderChooseEdition.bind(this)
    this.selectEdition = this.selectEdition.bind(this)

    this.state = {
      loaded: false,
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
      forSaleDate: parseInt(new Date().getTime() / 1000, 10), // now
      forSaleDateMoment: moment(), // now, with moment
      forSale: false,
      artistHasSigned: false,
      ipfsBase: '//ipfs.io/ipfs/',
      account: null,
      instance: null,
      newWithdrawalAmount: 0,
      contractLoaded: false,
      artworkLoaded: false,
      networkName: '',
      networkId: 0,
      artworkId: props.match.params.id - 1,
      editionId: (props.match.params.editionId || 1) - 1,
      numSales: 0,
      provenence: [],
      transactions:[],
      emptyCellMarker: '-',
      etherscanBase: '//etherscan.io',
      numEditions: 0
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
      if (name === 'rinkeby') this.setState({etherscanBase: '//rinkeby.etherscan.io'})
      if (name === 'unknown') this.setState({etherscanBase: '//unknown.etherscan.io'})
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
    const artgallery = contract(ArtGallery)
    artgallery.setProvider(this.state.web3.currentProvider)

    
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (accounts[0]) this.setState({account: accounts[0]})
        const contractId = getArtworkContract(this.state.networkName)
        if (contractId) {
          artgallery.at(contractId).then((instance) => {
            this.setState({
              instance,
              contractLoaded: true
            })
            this.updateState()
            return resolve()
          }).catch((err) => {
            this.setState({
              loaded: true,
              contractLoaded: false
            })
            return reject(err)
          })
        } else {
          this.setState({
            loaded: true,
            contractLoaded: false
          })
          return resolve()
        }
      })
    })
  }

  updateState() {
    this.state.instance['artworks'].call(this.state.artworkId).then((value) => {
      // Artwork ID does not exist.
      // state.artworkLoaded is currently false.
      if (value[0] === '0x0000000000000000000000000000000000000000') {
        this.setState({loaded: true})
      } else {
        this.setState({
          artist: value[0],
          artistName: value[1],
          title: value[2],
          description: value[3],
          createdYear: value[4].toNumber(),
          artThumbHash: value[5],
          artHash: value[6],
          numEditions: value[7].toNumber(),
          artistHasSigned: value[8]
        }, () => {
          this.state.instance['getEdition'].call(this.state.artworkId, this.state.editionId).then((value) => {
            // The requested edition for this artwork does not exist.
            // state.artworkLoaded is currently false.
            if (value[0] === '0x0000000000000000000000000000000000000000') {
              this.setState({
                loaded: true
              })
            }
            else {
              this.setState({
                owner: value[0],
                listingPrice: value[1].toNumber(),
                forSaleDate: value[2].toNumber(),
                forSale: value[3],
                artworkLoaded: true
              }, () => {
                this.state.instance['contractOwner'].call().then((value) => {
                  this.setState({
                    contractOwner: value,
                    loaded: true
                  }, () => {
                    this.state.instance['getSalesNum'].call(this.state.artworkId, this.state.editionId).then((value) => {
                      const provenenceLength = value.toNumber()
                      let provenence = []
                      for (let i = 0; i < provenenceLength; i++) {
                        this.state.instance['getProvenence'].call(this.state.artworkId, this.state.editionId, i).then((value) => {
                          provenence.push({
                            address: value[0],
                            amount: value[1].toNumber(),
                            date: value[2].toNumber()
                          })
                          if (i === (provenenceLength - 1)) this.setProvenence(provenence)
                        })
                      }
                    })
                  })
                })
              })
            }
          })
        })
      }
    })
  }

  setProvenence(provenence) {
    if (provenence.length) this.setState({provenence})
  }

  sign(evt) {
    evt.preventDefault()
    this.state.instance.signWork(this.state.artworkId, {from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      // this.updateState()
    })
  }

  listForSale(evt) {
    evt.preventDefault()
    const value = this.state.newListingPrice
    let date = this.state.forSaleDate
    if (date === 0) date = parseInt(new Date().getTime() / 1000, 10) // now
    this.state.instance.listWorkForSale(this.state.artworkId, this.state.editionId, value, date, {from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      // this.updateState()
    })
  }

  unlist(evt) {
    evt.preventDefault()
    this.state.instance.delistWorkForSale(this.state.artworkId, this.state.editionId, {from: this.state.account}).then((tx) => {
      const transactions = this.state.transactions.slice()
      transactions.push(tx.tx)
      this.setState({transactions})
      // this.updateState()
    })
  }

  buy(evt) {
    evt.preventDefault()
    const value = this.state.listingPrice
    this.state.instance.buy(this.state.artworkId, this.state.editionId, {
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

  updateForSaleDate(date) {
    this.setState({
      forSaleDateMoment: date,
      forSaleDate: date.format('X')
    });
  }

  selectEdition(event) {
    const edition = parseInt(event.target.value, 10) + 1
    window.location.href = window.location + edition
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

  renderNoArtwork() {
    return (
      <h1>No artwork with this ID found on the {this.state.networkName} network.</h1>
    )
  }

  renderArtwork() {
    const isOwner = this.state.account === this.state.owner
    if (!this.state.artThumbHash || !this.state.artHash) return
    const thumbnail = this.state.ipfsBase + this.state.artThumbHash
    const artwork = this.state.ipfsBase + this.state.artHash

    if (isOwner) {
        return <a href={artwork} target="_blank"><img src={artwork} alt={this.state.title} className="Artwork Original" /></a>
    } else {
      return <img src={thumbnail} alt={this.state.title} className="Artwork Thumbnail" />
    }
  }

  renderContract() {
    const titleHref = `/a/${this.state.artworkId}`
    return (
      <div>
        <h1><a href={titleHref}>{this.state.title}</a></h1>
        <h2>{this.state.artistName}, {this.state.createdYear}</h2>
        <div className="description">
          <p>{this.state.description}</p>
        </div>
        <div>
          {(this.state.numEditions === 1) || this.state.editionId > 0
            ? this.renderEdition()
            : this.renderChooseEdition()
          }
        </div>
      </div>
    )
  }

  renderChooseEdition() {
    let options = []
    options.push(<option key={-1}>Choose an edition</option>)
    for (let i = 0; i < this.state.numEditions; i++) {
      options.push(<option value={i} key={i}>{i + 1}</option>)
    }
    return (
      <div>
        <label htmlFor='editions'>Choose edition</label>
        <select
          id='editions'
          onChange={this.selectEdition}
        >
          {options}
        </select>
      </div>
    )
  }

  renderEdition() {
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

    const now = parseInt(new Date().getTime() / 1000, 10)
    const forSaleInFuture = this.state.forSaleDate > now
    let forSaleString = ''
    if (forSaleInFuture) {
      const day = moment(this.state.forSaleDate * 1000).format('MMMM Do, Y')
      const time = moment(this.state.forSaleDate * 1000).format('h:mm a')
      forSaleString = `${day} at ${time} in your local timezone.`
    }

    return (
    <div>
      {identity && (
        <h4><em>{identity}</em> 😁</h4>
      )}
      {isOwner && (
        <ChromecastButton hash={this.state.artHash} />
      )}
      <div>
        <em>
          {this.state.forSale
            ? <span>This work is for sale for {saleAmount} ETH</span>
            : <span>This work is not for sale</span>
          }
        </em>
      </div>
      <div>
        <em>
          {this.state.forSale && forSaleInFuture && (
            <span>This work will be available for sale at {forSaleString}</span>
          )}
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

      {isOwner && !this.state.forSale && this.state.artistHasSigned && (
        <div>
          <div>
            <label htmlFor="forSaleDate">Set for sale date</label>
            <DatePicker
              selected={this.state.forSaleDateMoment}
              onChange={this.updateForSaleDate}
              value={this.forSaleDateMoment}
              showTimeSelect
              dateFormat="LLL" />
          </div>
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
        </div>
      )}

      {isOwner && this.state.forSale
        ? (
          <div>
            <span><a className="pure-button" onClick={this.unlist}>Unlist from sale</a></span>
          </div>
        )
        : <span/>
      }

      {this.state.forSale && (!isArtist || !isOwner) && !forSaleInFuture && (
        <div>
          <span><a className="pure-button" onClick={this.buy}>Buy</a></span>
          <span>{saleAmount} ETH</span>
        </div>
      )}

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
    )
  }

  render() {

    return (
      <Loader loaded={this.state.loaded}>
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
                    ? this.state.artworkLoaded
                      ? this.renderContract()
                      : this.renderNoArtwork()
                    :  this.renderNoContract()
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
              {this.state.contractLoaded && this.state.artworkLoaded && (
                <div className="frame">
                    {this.renderArtwork()}
                </div>
              )}
            </div>
          </div>
        </div>
      </Loader>
    )
  }
}

export default App
