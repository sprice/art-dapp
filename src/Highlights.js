import React, { Component } from 'react'
import Nav from './Nav'
import highlights from './utils/getHighlights'

class Highlights extends Component {

  constructor(props) {
    super(props)

    this.renderHighlight = this.renderHighlight.bind(this)

    this.state = {
      highlights: highlights()
    }
  }

  renderHighlight(id) {
    const src = `//ipfs.io/ipfs/${this.state.highlights[id].artThumbHash}`
    const href = `/a/${id + 1}`
    const text = this.state.highlights[id].text
    return (
      <div>
        <div className="frame-wrap">
          <div className="frame">
              <a href={href}><img className="main-image" src={src} alt="Artwork" /></a>
          </div>
        </div>
        <p className="center"><em>{text}</em></p>
      </div>
    )
  }

  render() {
    return (
      <div>
          <div className="highlights">
            <div className="primary">
              <Nav />
              <div className="pure-g">
                <div className="pure-u-1-1">
                  <div className="info">
                  </div>
                </div>
              </div>
            </div>
            <div className="secondary colored-1">
              {this.renderHighlight(0)}
            </div>
          </div>
          <div className="highlights">
            <div className="primary framed colored-2">
              {this.renderHighlight(1)}
            </div>
            <div className="secondary">
            </div>      
          </div>
        </div>
    )
  }
}

export default Highlights
