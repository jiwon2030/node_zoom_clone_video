import http from "http";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
//import WebSocket from "ws";
import express from "express";
import path from 'path';
import { off } from "process";

const app = express();

app.set("view engine", "pug");
app.set("src","/src");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => res.render("home")); // 홈페이지로 이동시 사용될 템플릿을 렌더해줌.
app.get("/*", (req, res) => res.redirect("/"));
 
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName, done) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer" , (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    })
});

const handleListen = () => console.log('Listening on http://localhost:3001');
httpServer.listen(3001, handleListen);