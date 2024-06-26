#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("dotenv").config();

var debug = require("debug")("react-socket:server");
var http = require("http");
var app = require("./app");
var { Server } = require("socket.io");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Create SOCKET.IO server.
 */
// const clients = {};
const clients = {};
var io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ADDRESS,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} is connected to the server`);
  clients[socket.id] = socket;

  socket.on("msg_sent_evnt", (data) => {
    socket.broadcast.emit("emt_rcv_msg", { clientId: socket.id, resType: "server", msg: data.msg });
  });

  socket.on("disconnect", () => {
    delete clients[socket.id];
  });
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    console.log("unable to start the server");
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log("Server started on port " + addr.port);
}
