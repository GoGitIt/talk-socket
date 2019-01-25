import React from 'react';
import Login from './Login.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            loggedIn: false,
            messages: []
        }
        this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        this.connection = new WebSocket('ws://localhost:8080');

        this.connection.onopen = () => {
            console.log('Connected to websocket server');
        }

        this.connection.onmessage = (m) => {
            this.handleIncomingMessage(m);
        }
    }

    handleLogin(username) {
        console.log('Username', username);
        if (username === 'submit') {
            this.connection.send(this.state.username);
            this.setState({loggedIn: true});
        } else {
            let newUsername = username;
            this.setState({username: newUsername});
        }
    }

    handleIncomingMessage(message) {
        console.log('Incoming message:', JSON.parse(message.data))
        let newMessage = JSON.parse(message.data);
        console.log('newMessage:', newMessage.data.text)
        let oldMessages = this.state.messages;
        oldMessages.push(newMessage.data.text);
        console.log(oldMessages)
        this.setState({messages: oldMessages});
    }

    sendMessage(message) {
        console.log('?', document.getElementsByClassName('text')[0].value);
        
        let messageObj = {
            time: (new Date()).getTime(),
            username: this.state.username,
            text: message.utf8Data
        };
        this.connection.send(document.getElementsByClassName('text')[0].value);
    }

    render() {

        if (this.state.loggedIn === false) {
            return <Login handleLogin={this.handleLogin}/>;
        } else {
            return (<div>
                <div>Welcome to talk-socket</div>
                {this.state.messages.map((m) => { return <div>{m}</div> })}
                <form><input className={'text'}></input>
                </form>
                <button onClick={this.sendMessage}> Send message </button>
            </div>);
        }
    }
}

export default App;