const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const express = require('express')

const server = express()
    .use(function (req, res) {
        console.log('Time: %d', Date.now())
        //res.sendfile(__dirname + '/index.html');
    })
    // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => {
        console.log('listening on port 3000')
        const socketIO = require('socket.io')
        const io = socketIO(server);

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
    });