const {Server}  = require("socket.io");
const {createServer} = require("http");

const express = require("express");

const app = express();


 const server = createServer(app);
 const io = new Server(server,  
    {
    cors: {
      origin: ['http://localhost:5173'],
      methods: ["GET", "POST"],
    }
  }
);

const ActiveUserMap = new Map();

io.on('connection' ,(socket)=>{
  
  console.log("new socket connect", socket.id);

  const userid = socket.handshake.query.S_UID

  
  ActiveUserMap.set(userid,socket.id)
  socket.on('disconnect',(socket)=>{
      console.log(`disconnect`)
  })
})

 module.exports = {
  app,
  server,
  io,
  ActiveUserMap
 }

