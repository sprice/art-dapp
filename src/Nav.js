import React from 'react'

const Nav = ({ match }) => (
  <nav className="navbar pure-menu pure-menu-horizontal">
    <div>
      <a href="/" className="pure-menu-heading pure-menu-link">Chill</a>
    </div>
    <div>
      <a href="/about" className="pure-menu-heading pure-menu-link">About</a>
    </div>
    <div>
      <a href="/highlights" className="pure-menu-heading pure-menu-link">Highlights</a>
    </div>
    <div>
      <a href="/updates" className="pure-menu-heading pure-menu-link">Updates</a>
    </div>
  </nav>
)

export default Nav
