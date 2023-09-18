require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT_SOCKET || 18092;

class SocketIo {
  constructor(keyMeg = "message") {
    this.keyMeg = keyMeg;
    app.get("/", (req, res) => {
      res.send("Socket.IO server running");
    });
    http.listen(port, () => {
      console.log(`Socket.IO server running at http://localhost:${port}/`);
    });
  }
  getMessage(key) {
    if (!key) key = this.keyMeg;
    io.on("connection", (socket) => {
      socket.on(key, (msg) => {
        console.log("nhan: ", msg);
        io.emit(key, msg);
      });
    });
  }
  sendMessage(meg, key) {
    if (!key) key = this.keyMeg;
    io.on("connection", (socket) => {
      console.log("gui:", new Date().toLocaleTimeString());
      //socket.broadcast.emit(key, meg);
      io.emit(key, meg);
    });
  }
}

module.exports = { SocketIo };
