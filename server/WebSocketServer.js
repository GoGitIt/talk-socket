const WebSocketServer = require('websocket').server;
const http = require('http');

let history = [];
let clients = [];

let websocketServer = () => {
    
    //Create HTTP server for WebSocket to utilize
    var server = http.createServer(function (request, response) {
    });

    //HTTP server listening
    server.listen(8080, function () {
        console.log((new Date()) + " HTTP Server is listening on port "
            + 8080);
    });

    //Create WebSocket server and attach to HTTP server
    WebsocketServer = new WebSocketServer({
        httpServer: server
    });

    //When WebSocket server receives a request it gets handled here. Messages are considered requests.
    WebsocketServer.on('request', function (request) {
        var connection = request.accept('echo-protocol', request.origin);

        //Keeps track of connected clients, adds them to the clients array and records their index within the array
        let index = clients.push(connection) - 1;
        console.log('New connection from client', 'Total clients: ', clients.length);

        //Handles all messages sent from client with .send()
        connection.on('message', function (message) {
            console.log('Message received by server:', message);

            if (message.type === 'utf8') {

                let messageObj = {
                    time: (new Date()).getTime(),
                    author: 'noUsersYet',
                    text: message.utf8Data
                };

                //Store the last 100 messages so we can keep newly connected users up to date with the conversation
                history.push(messageObj);
                history = history.slice(-100);

                //Create a message object so we can store some additional info like timestamp
                let jsonPackage = JSON.stringify({type: 'message', data: messageObj});

                //Send the new message to all currently connected clients
                for (client in clients) {
                    clients[client].sendUTF(jsonPackage);
                }
            }
        });

        connection.on('close', function (connection) {
            console.log('Connection closed!');

            //Remove user from list of connected clients upon disconnecting
            clients.splice(index, 1);
        });
    });
}

module.exports = websocketServer;