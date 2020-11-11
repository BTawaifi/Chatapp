const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const users = {}

io.on("connection", socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id]
    })
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});