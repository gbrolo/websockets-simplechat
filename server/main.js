/**
 * main.js
 * 
 * Express server (websockets)
 * @author: gbrolo
 * 
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var websockets = require('socket.io')(server);
var fetch = require('node-fetch');

// message array
messages = [];

// set public directory as static side of webapp
app.use(express.static('public'));

// when connected
websockets.on('connection', function(socket) {
    // fetch messages
    getMessages();
    socket.emit('refresh', messages);

    // for new messages
    socket.on('new', function() {
        // POST request
        sendMessage();
    })

});

// get messages
function getMessages() {
    fetch('http://34.210.35.174:7000')
     .then(function(response) {
         return response.json();
     })
     .then(function(data) {
         messages = data;
         websockets.sockets.emit('refresh', messages);
     })
}

// POST request to submit message
function sendMessage() {
    // refresh messages
    getMessages();        
}

server.listen(8080, function() {
    console.log('Server is running');
    getMessages();
});