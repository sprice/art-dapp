import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'
const ReactGA = require('react-ga')
const Raven = require('raven-js')

let isDev = true
switch (window.location.hostname) {
case "localhost":
case "127.0.0.1":
    break;
default:
    isDev = false
}

if (!isDev) ReactGA.initialize('UA-107878547-1')
if (!isDev) Raven.config('https://a3fa06657e8549cdb16fe5bede55108e@sentry.io/231702').install()

const render = () => {
    if (!isDev) ReactGA.pageview(window.location.pathname)
    ReactDOM.render(
        <Routes />,
        document.getElementById('root')
    )
}

render()