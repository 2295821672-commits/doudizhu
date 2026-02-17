const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

let players = [];
let identityCard = null; // 身份牌

io.on('connection', (socket) => {
    if (players.length < 5) {
        players.push({ id: socket.id, cards: [] });
        io.emit('server_msg', `目前人数: ${players.length}/5`);
    }

    // 5人齐，发牌逻辑
    if (players.length === 5) {
        const ranks = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]; 
        const suits = ['h','d','c','s'];
        let deck = [];
        for(let i=0; i<2; i++) {
            ranks.forEach(r => {
                if(r < 16) suits.forEach(s => deck.push({rank:r, suit:s}));
                else deck.push({rank:r, suit: r===16?'small':'big'});
            });
        }
        // 洗牌略... 随机选一张做身份牌
        identityCard = deck[Math.floor(Math.random() * 100)];
        io.emit('game_start', { identity: identityCard });
    }
});

http.listen(process.env.PORT || 3000);
