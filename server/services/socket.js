/**
 * Socket service used to send messages through socket.io web socket connection
 */
var socketClients = {};


function Socket(server) {

    if (!(this instanceof Socket)) return new Socket(server);

    var io = require('socket.io')(server);

    io.sockets.on('connection', function (socket) {
        socket.on('registerUser', function (data) {
            socketClients[data.userEmail] = socket;
        });
    });
}

/**
 * Emits an event belonging to the socket of the user with the email address provided. 
 * Event name and message are to be passed as parameters.
 */
Socket.prototype.update = (userEmail, eventName, message) => {
    socketClients[userEmail].emit(eventName, message);
}

Socket.prototype.disconnect = (userEmail) => {
    socketClients[userEmail].disconnect();
    delete socketClients[userEmail];
}

module.exports = Socket
