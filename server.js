const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

let players = [];

io.on('connection', (socket) => {
    if (players.length < 5) {
        players.push(socket.id);
        io.emit('server_msg', `目前人数: ${players.length}/5`);
    }
    socket.on('disconnect', () => {
        players = players.filter(id => id !== socket.id);
        io.emit('server_msg', `人数变动: ${players.length}/5`);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server is running!'));
