
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

    if (!globalData.server.initGame) {
        globalData.server.initGame = true;
    }

    // Players Connected
    globalData.server.totalUsers++;
    _updateServerAppState();

    // Players Disconnected
    socket.on('disconnect', function() {
        globalData.server.totalUsers--;
        _updateServerAppState();

    });

    // Listen Client app state
    socket.on('client-app-state', function(data) {
        globalData.client = data;

        if (globalData.client.linkStartIsClicked && globalData.server.currentRoute != globalData.server.routes[1]) {
            globalData.server.currentRoute = globalData.server.routes[1];
            _updateServerAppState();
        }

        console.log('<---- Data Client: ----->');
        console.log(globalData.client);
        console.log('</--------->');
    })

});

function _updateServerAppState() {
    io.emit('server-app-state', globalData);

    console.log('<---- Data Server: ----->');
    console.log(globalData.server);
    console.log('</--------->');
}

// Go go server!
http.listen(3000, function(){
    console.log('listening on *:3000');
});

