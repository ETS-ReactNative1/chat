const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
//on utilise socket.io et on défini le propriété du server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

let users = {};

//on récupère l'id grâce a socket IO
io.on("connection", (socket)  => {
    console.log(`User connected ${socket.id}`);

//Récupération de la room
    socket.on("join_room", (data) => {
        socket.join(data.room);
        users[socket.id] = data.username;
        console.log(`User with username: ${data.username} ID: ${socket.id} joined room: ${data.room}`);
    });
//Des messages envoyer
    socket.on("send_message", (data) => {
        data["username"] = users[socket.id];
        socket.to(data.room).emit("receive_message", data);
        console.log(data);
    })

//Et si l'user se déconnecté
    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`)
        delete users[socket.id];
    });
});

//Quand le server est up on log un "server is running"
server.listen(3001, () => {
    console.log('SERVER IS RUNNING');
})