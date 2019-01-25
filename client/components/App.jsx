import React from 'react';
import Axios from 'axios';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            messages: []
        }
        this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.connection = new WebSocket('ws://localhost:8080', 'echo-protocol');

        this.connection.onopen = () => {
            console.log('Connected to websocket server');
            this.setState({ connected: true });
        }

        this.connection.onmessage = (m) => {
            this.handleIncomingMessage(m);
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
        this.connection.send(document.getElementsByClassName('text')[0].value);
    }

    render() {
        return (<div>
            <div>ELLO WERL</div>
            {this.state.messages.map((m) => {return <div>{m}</div>})}
            <form><input className={'text'}></input>
            </form>
            <button onClick={this.sendMessage}> Send message </button>
        </div>);
    }
}

export default App;