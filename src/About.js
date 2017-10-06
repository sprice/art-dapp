import React from 'react'

const About = ({ match }) => (
  <div className="App">
    <nav className="navbar pure-menu pure-menu-horizontal">
      <div className="">
        <a href="/" className="pure-menu-heading pure-menu-link">Chill</a>
      </div>
      <div className="">
        <a href="/about" className="pure-menu-heading pure-menu-link">About</a>
      </div>
    </nav>

    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1 className="title">About Chill</h1>
          <div className="info">
            <h2>Purchase art using Ethereum</h2>
            <ul>
              <li>Install the <a href="https://metamask.io/">Metamask</a> Chrome extension.</li>
              <li><strike>Buy Ethereum using Metamask (USA only). Otherwise, we recommend <a href="https://www.coinbase.com/buy-ethereum">Coinbase</a>.</strike></li>
              <li>While Chill is in public beta, get test ether (the currency of Ethereum) using the <a href="https://www.rinkeby.io/">Rinkeby Faucet</a> (requires Github)</li>
            </ul>
          </div>
          <div className="info">
            <h2>Connect Metamask to the Rinkeby test network</h2>
            <p>Chill is in public beta and works of art are not for sale for real ether (the currency of Ethereum). We&rsquo;re currently using the Rinkeby test network. Make sure Metamask is connected to Rinkeby.</p>
          </div>
          <div className="info">
            <h2>Treasure your Metamask/Ethereum account</h2>
            <p>The account you use to purchase art will be recorded as the owner of the artwork. If you lose access to your account you lose access to the rights of ownership.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
)

export default About
