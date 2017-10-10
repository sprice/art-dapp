import React from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './Homepage.css'

// const selectedWork = {
//   thumb: 'https://ipfs.io/ipfs/QmT7Tko852jEgrFE9EWT1gHeBjydsobFcQssq8YizPFeGJ',
//   title: 'Autumn',
//   artist: 'Shawn Price',
//   year: 2017,
//   url: '/a/1'
// }

const Homepage = ({ match }) => (
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
          <h1 className="title">Introducing True Digital Ownership Of Fine Art</h1>
          <div className="info">
            <h2>A curated marketplace for collectors &amp; artists</h2>
            <p>Chill is an online art gallery. We showcase curated art which artists sell directly to collectors. Collectors can enjoy the art they own, offer works on loan, or place works for sale.</p>
          </div>
          <div className="info">
            <h2>Secure on the Blockchain</h2>
            <p>The record of ownership, proof of authenticity, and the artwork itself is secured using Blockchain technology. One day Chill might not be around but your art will be. And we&rsquo;ll provide you with the open-source tools to always enjoy your art your way.</p>
          </div>
          <div className="info">
            <h2>Currently in Closed Beta</h2>
            <p>Chill is just getting started. We&rsquo;re currently working with our initial group of artists. Please note we only have test content on the platform which is for sale using test currency. More details on our <a href="/about">About</a> page.</p>
          </div>
        </div>
        <div className="pure-u-1-1">
          {/*} Begin MailChimp Signup Form */}
          <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css" />
          <div id="mc_embed_signup">
            <form action="https://ist.us16.list-manage.com/subscribe/post?u=bdf08ecde40d559699147e198&amp;id=f15e568e31" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
              <div id="mc_embed_signup_scroll">
                <label htmlFor="mce-EMAIL">Sign up and join the beta</label>
                <input type="email" value="" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
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
    </main>
  </div>
)

export default Homepage
