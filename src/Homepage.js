import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/grids-responsive-min.css'
import './App.css'
import './Homepage.css'

// const selectedWork = {
//   thumb: 'https://ipfs.io/ipfs/QmT7Tko852jEgrFE9EWT1gHeBjydsobFcQssq8YizPFeGJ',
//   title: 'Autumn',
//   artist: 'Shawn Price',
//   year: 2017,
//   url: '/a/1'
// }

class Homepage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      subscribeEmail: ''
    }
  }

  updateSubscribeEmail(event) {
    this.setState({subscribeEmail: event.target.value})
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
              <h1 className="center title">Introducing True Ownership Of Digital Fine Art</h1>
              <div className="info">
                <h2>For Collectors</h2>
                <p>Build your collection of unique and rare digital art. Display art on your favourite devices.</p>
              </div>
              <div className="info">
                <h2>For Artists</h2>
                <p>The record of ownership, proof of authenticity, and the artwork itself is secured using Blockchain technology. Chill is a platform to easily &amp; securely sell your art to collectors.</p>
              </div>
            </div>
            <div className="pure-u-1-1">
              {/*} Begin MailChimp Signup Form */}
              <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css" />
              <div id="mc_embed_signup">
                <form action="https://ist.us16.list-manage.com/subscribe/post?u=bdf08ecde40d559699147e198&amp;id=f15e568e31" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                  <div id="mc_embed_signup_scroll">
                    <label htmlFor="mce-EMAIL">Stay up to date with our newsletter</label>
                    <input onChange={this.updateSubscribeEmail} type="email" value={this.state.subscribeEmail} name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
                    {/*} real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                    <div style={{position: 'absolute', left: '-5000px', ariaHidden: true}}>
                      <input type="text" name="b_bdf08ecde40d559699147e198_f15e568e31" tabIndex="-1" value="" />
                    </div>
                    <div className="clear">
                      <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
                    </div>
                  </div>
                </form>
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
  }
}

export default Homepage
