import React from 'react'
import Nav from './Nav'

const contractHref = 'https://rinkeby.etherscan.io/address/0xd275a265038c9ab985bc96a81aaabcceef8f57b9#code'

const Updates = ({ match }) => (
  <div className="app">
    <div className="primary">
      <Nav />
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1 className="center title">Updates</h1>
          <div className="info">
            <h2>October 15, 2017</h2>
            <p>The beta is live on Rinkeyby! Please provide feedback using the chat widget near the bottom right. Our <a href="https://rinkeby.etherscan.io/address/0xd275a265038c9ab985bc96a81aaabcceef8f57b9#code">contract</a> is available for review. We plan to audit this before deplying to mainnet but if you do see any issues please feel free to report them 😃.</p>
            <p>Please note that we will likely destory/deploy this contract multiple times while in beta.</p>
            <p>Head on over to the <a href="https://www.rinkeby.io/">Rinkeby faucet</a> to load up on test Ether.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="secondary">
      <div className="frame-wrap fixed">
        <div className="frame">
            <img className="main-image" src="/img/1.jpg" alt="Pineapple" />
        </div>
      </div>
    </div>
  </div>
)

export default Updates
