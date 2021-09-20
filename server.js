const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const helmet = require("helmet")
const compression = require("compression");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./public/users");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(compression());

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.broadcast.to(user.room).emit("user-connected", user.username);
    io.emit("users-online", getRoomUsers(user.room));

    socket.on("send-chat-message", (message) => {
      socket.broadcast
        .to(user.room)
        .emit("chat-message", {
          message: message,
          name: getCurrentUser(socket.id).username,
        });
    });
    socket.on("disconnect", () => {
      socket.broadcast
        .to(user.room)
        .emit("user-disconnected", getCurrentUser(socket.id).username);
      userLeave(socket.id);
      io.emit("users-online", getRoomUsers(user.room));
    });
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
