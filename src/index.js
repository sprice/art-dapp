import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'
const ReactGA = require('react-ga')

let isDev = true
switch (window.location.hostname) {
case "localhost":
case "127.0.0.1":
    break;
default:
    isDev = false
}

if (!isDev) ReactGA.initialize('UA-107878547-1')

const render = () => {
    if (!isDev) ReactGA.pageview(window.location.pathname)
    ReactDOM.render(
        <Routes />,
        document.getElementById('root')
    )
}

render()