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
      createdYear: '',
      forSaleDate: '',
      forSale: false,
      artistHasSigned: false,
      ipfsBase: '//ipfs.io/ipfs/'
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

    // Declaring this for later so we can chain functions on SimpleStorage.
    var digitalArtWorkInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      digitalArtWork.at('0x0912279429798e39540fceb92434549ac3b4a4bc').then((instance) => {
        digitalArtWorkInstance = instance
        return digitalArtWorkInstance.title.call()
      }).then((title) => {
        this.setState({title})
        return digitalArtWorkInstance.artistName.call()
      }).then((artistName) => {
        this.setState({artistName})
        return digitalArtWorkInstance.createdYear.call()
      }).then((createdYear) => {
        this.setState({createdYear: createdYear.toNumber()})
        return digitalArtWorkInstance.artThumbHash.call()
      }).then((artThumbHash) => {
        this.setState({artThumbHash})
        return digitalArtWorkInstance.forSale.call()
      }).then((forSale) => {
        console.log(forSale)
        this.setState({forSale})
        return digitalArtWorkInstance.artistHasSigned.call()
      }).then((artistHasSigned) => {
        this.setState({artistHasSigned})
      })
    })
  }

  render() {

    const thumbnail = this.state.ipfsBase + this.state.artThumbHash

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Art Gallery</a>
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
                  {this.state.forSale
                    ? <span>This work is for sale</span>
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
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
