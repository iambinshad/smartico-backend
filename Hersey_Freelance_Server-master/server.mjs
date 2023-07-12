import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app.mjs'
import { Server } from "socket.io";
import http from 'http'

dotenv.config({path: './config.env'})

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection
.once("open",()=>console.log("database connected successfully"))
.on("error",error => {
    console.log("error: ",error);
})

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
  })
  
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    // console.log('Client connected:', socket.id);
    // const chatSocket = socket;
    socket.on("addUser", (id) => {
        onlineUsers.set(id, socket.id);
    })
    socket.on("send-msg", (data) => {
        console.log("Received send-msg event:", data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          console.log("Emitting msg-receive event:", data.message);
          socket.to(sendUserSocket).emit("msg-receive", { message: data.message });
        }
      });
    // socket.on("send-msg", (data) => {
    //     const sendUserSocket = onlineUsers.get(data.to)
    //     if (sendUserSocket) {
    //         socket.to(sendUserSocket).emit("msg-receive", data.message)
    //     }
    // })

    socket.on('connect', () => {
        console.log('Client Connected:', socket.id);
    });
  
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
  
  })

server.listen(3500, () => {
    console.log('server started')
})
