const WebSocketServer = require('websocket').server;
const http = require('http');

let history = [];
let clients = [];

let websocketServer = () => {
    
    var server = http.createServer(function (request, response) {
        // Not important for us. We're writing WebSocket server,
        // not HTTP server
    });

    server.listen(8080, function () {
        console.log((new Date()) + " HTTP Server is listening on port "
            + 8080);
    });

    // create the server
    WebsocketServer = new WebSocketServer({
        httpServer: server
    });

    // WebSocket server
    WebsocketServer.on('request', function (request) {
        var connection = request.accept('echo-protocol', request.origin);
        let index = clients.push(connection) - 1;
        console.log('New connection from client', 'Total clients: ', clients.length);

        // This is the most important callback for us, we'll handle
        // all messages from users here.
        connection.on('message', function (message) {
            console.log('Message received by server:', message);
            if (message.type === 'utf8') {

                let messageObj = {
                    time: (new Date()).getTime(),
                    author: 'noUsersYet',
                    text: message.utf8Data
                };

                history.push(messageObj);
                history = history.slice(-100);

                let jsonPackage = JSON.stringify({type: 'message', data: messageObj});
                for (client in clients) {
                    clients[client].sendUTF(jsonPackage);
                }
                
                // process WebSocket message
                console.log('New Message:', message);
                connection.sendUTF(message.utf8Data);
            }
        });

        connection.on('close', function (connection) {
            // close user connection
            console.log('Connection closed!');
            clients.splice(index, 1);
        });
    });
}

module.exports = websocketServer;