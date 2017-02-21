const app = require('http').createServer(handler);
const io = require('socket.io').listen(app);
const fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// Listen for a connection event
io.sockets.on('connection', function (socket) {
  // Upon connection, send a message to the socket
  socket.emit('news', 'Welcome to the chat!');

  // Listen for 'send message' and reply 'new message'
  socket.on('send message', function (data) {
    io.sockets.emit('new message', data);
  });

  // beta rooms only
  socket.on('send message2', function (data) {
    io.sockets.in('beta').emit('new message', data);
  });

  socket.on('subscribe', function (data) {
    socket.join(data.room);
  })
});
