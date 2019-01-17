var app = require('http').createServer(handler);
var io = require('socket.io')(app);

app.listen(3000);

function handler(req, res) {
  res.writeHead(200);
  res.end("<html><body><h1>Socket Server</h1></body></html>");
}
var players = [];

io.on('connection', function(socket) {
    var myPlayerNumber;

    console.log('User connected');

    socket.on('controller_data', function(data) {
        if (!myPlayerNumber)
        {
            if (!players[1])
            {
                players[1] = socket.id;
                myPlayerNumber = 1;

            } else if (!players[2])
            {
                players[2] = socket.id;
                myPlayerNumber = 2;
            }

            console.log('Player ' + myPlayerNumber + ' connected.');
        }

        socket.broadcast.emit('controller_data_' + myPlayerNumber, data);
    });

    socket.on('disconnect', function() {
        players[myPlayerNumber] = null;
        console.log('Player ' + myPlayerNumber + ' disconnected.');
    });
});

