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
  getMessage(key,callback) {
    if (!key) key = this.keyMeg;
    io.on("connection", (socket) => {
      socket.on(key, (msg) => {
        callback(msg)
        io.emit(key, msg);
      });
    });
  }
  async asyncGetMessage(key) {
    if (!key) key = this.keyMeg;
    return new Promise((res, rej) => {
      io.on("connection", (socket) => {
        socket.on(key, (msg) => {
          io.emit(key, msg)
          res(msg);
        });
      });
    });
  }
  sendMessage(meg, key) {
    if (!key) key = this.keyMeg;
    io.on("connection", (socket) => {
      //socket.broadcast.emit(key, meg);
      io.emit(key, meg);
    });
  }
}

module.exports = { SocketIo };
