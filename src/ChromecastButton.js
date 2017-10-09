import React from 'react'
const {Component} = React
const PropTypes = require('prop-types')

class ChromecastButton extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hash: props.hash,
            session: null,
            namespace: 'urn:x-cast:com.google.cast.chill.ist',
            appId: 'FBD5C31C',
            chrome: null
        }

        this.initializeCastApi = this.initializeCastApi.bind(this)
        this.onInitSuccess = this.onInitSuccess.bind(this)
        this.onError = this.onError.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
        this.sessionListener = this.sessionListener.bind(this)
        this.sessionUpdateListener = this.sessionUpdateListener.bind(this)
        this.receiverMessage = this.receiverMessage.bind(this)
        this.receiverListener = this.receiverListener.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.sendCast = this.sendCast.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            if (window.chrome && window.chrome.cast.isAvailable) {
                this.setState({chrome: window.chrome})
                this.initializeCastApi()
            }
        }, 1000)
    }

    initializeCastApi() {
        const sessionRequest = new this.state.chrome.cast.SessionRequest(this.state.appId);
        var apiConfig = new this.state.chrome.cast.ApiConfig(sessionRequest,
            this.sessionListener,
            this.receiverListener);

        this.state.chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
    }

    onInitSuccess() {
        console.log('onInitSuccess')
    }

    onError(message) {
        console.log('onError: ' + JSON.stringify(message))
    }

    onSuccess(message) {
        console.log('onSuccess: ' + message);
    }

    sessionListener(e) {
        console.log('New session ID:' + e.sessionId);
        this.setState({session: e})
        this.state.session.addUpdateListener(this.sessionUpdateListener);
        this.state.session.addMessageListener(this.state.namespace, this.receiverMessage);
    }

    sessionUpdateListener(isAlive) {
        var message = isAlive ? 'Session Updated' : 'Session Removed';
        message += ': ' + this.state.session.sessionId;
        console.log(message)
        if (!isAlive) {
          this.setState({session: null})
        }
    }

    receiverMessage(namespace, message) {
        console.log('receiverMessage: ' + namespace + ', ' + message);
    }

    receiverListener(e) {
        if(e === 'available') {
          console.log('receiver found');
        }
        else {
          console.log('receiver list empty');
        }
    }

    sendMessage(message) {
        if (this.state.session != null) {
            this.state.session.sendMessage(this.state.namespace, message, this.onSuccess.bind(this, 'Message sent: ' + message),
            this.onError)
        }
        else {
          this.state.chrome.cast.requestSession((e) => {
              this.setState({session: e})
              this.state.session.sendMessage(this.state.namespace, message, this.onSuccess.bind(this, 'Message sent: ' +
                    message), this.onError)
            }, this.onError)
        }
    }

    sendCast(event) {
        event.preventDefault()
        this.sendMessage(this.state.hash)
    }

    render() {
        return (
            <h5><a href="#" onClick={this.sendCast}>Cast artwork</a></h5>
        )
    }
}

ChromecastButton.propTypes = {
    hash: PropTypes.string.isRequired
}

export default ChromecastButton
