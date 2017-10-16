import React from 'react'
import Nav from './Nav'

const contractHref = 'https://rinkeby.etherscan.io/address/0xd275a265038c9ab985bc96a81aaabcceef8f57b9#code'

const About = ({ match }) => (
  <div className="app">
    <div className="primary">
      <Nav />
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1 className="center title">About Chill</h1>
          <div className="info">
            <h2>A new way to think about digital ownership</h2>
            <p>The Blockchain allows for trustless proof that an artwork created on the Chill platform is unique, rare, and authentic. There is also the added benefit that all functions of an artwork, from buying and selling to loaning, can occur with or without the Chill platform. Once an artwork is created, it is permanent. If Chill should ever shut down or dissapear, your art will continue to exist and remain yours.</p>
          </div>
          <div className="info">
            <h2>Full transparency</h2>
            <p>If you&rsquo;re nerdy like us, you can view the <a href={contractHref}>source code</a> for our Ethereum smart contract.</p>
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

export default About
