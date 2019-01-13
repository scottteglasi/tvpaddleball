var app = require('http').createServer(handler);
var io = require('socket.io')(app);

app.listen(3000);

function handler(req, res) {
  res.writeHead(200);
  res.end("<html><body><h1>Socket Server</h1></body></html>");
}

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('controller_data', function(data) {
        console.log(JSON.stringify(data));
        socket.broadcast.emit('controller_data', data);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

