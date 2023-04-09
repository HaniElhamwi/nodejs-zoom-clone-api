const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 3001;

const users = [];

const addUser = (userName, roomId) => {
  users.push({
    userName,
    roomId,
  });
};

const getRoomUses = (roomId) => {
  return users.filter((user) => user.roomId === roomId);
};
const userLeave = (userName) => {
  return users.filter((user) => user.userName != userName);
};

app.get("/", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);
    addUser(userName, roomId);
    console.log(roomId);
    console.log(userName);
    socket.to(roomId).emit("user-connected", userName);
    io.to(roomId).emit("all-users", getRoomUses(roomId));
    socket.on("disconnect", () => {
      console.log("disconnected");
      socket.leave(roomId);
      userLeave(userName);
      io.to(roomId).emit("all-users", getRoomUses(roomId));
    });
  });
});

server.listen(port, () => {
  console.log(`Zoom clone api listening on ${port}`);
});
