
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    util = require('util');

    globalData = {
        server: {
            initGame: false,
            totalUsers: 0,
            routes: [
                'index',
                'start',
                'finish'
            ],
            currentRoute: 'index'
        },
        client: {} // Data from Client
    }

app
    .use(express.static('./public'))
    .get('/', function(req, res) {
        res.sendFile(__dirname + '/public/main.html');
    });

io.on('connection', function(socket) {
    console.log('user connected');

    if (!globalData.server.initGame) {
        globalData.server.initGame = true;
    }

    // Players Connected
    globalData.server.totalUsers++;
    _updateServerData();

    // Players Disconnected
    socket.on('disconnect', function() {
        globalData.server.totalUsers--;
        _updateServerData();

    });

    // Listen Client app state
    socket.on('client-app-data', function(clientData) {
        for (var key in clientData) {
            globalData.client[key] = clientData[key];
        }
        _showServerData();
    })
});

function _updateServerData() {
    io.emit('server-app-data', globalData);
}

function _showServerData() {
    console.log('/*************/');
    console.log(globalData);
    console.log('/*************/');
}

// Go go server!
http.listen(3000, function(){
    console.log('listening on *:3000');
});
