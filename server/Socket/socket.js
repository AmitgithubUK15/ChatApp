const {Server}  = require("socket.io");
const {createServer} = require("http");

const express = require("express");

const app = express();


 const server = createServer(app);
 const io = new Server(server,  
    {
    cors: {
      origin: ['https://snickertalk.netlify.app'],
      methods: ["GET", "POST"],
    }
  }
);

let ActiveUserMap = new Map();

io.on('connection' ,(socket)=>{
  
  console.log("new socket connect", socket.id);

  const userid = socket.handshake.query.userID

  ActiveUserMap.set(userid,socket.id)

  socket.on("client-disconnect",(data)=>{
    ActiveUserMap.delete(`${data.userId}`)
  })

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

