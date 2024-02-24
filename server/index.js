const express = require('express');
const app = express();

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors())

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

//Add this before the app.get() block
let users = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});
app.get('/',(req,res) => {
    res.send("Hii")
})

http.listen(3000)