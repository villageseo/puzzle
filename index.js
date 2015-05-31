
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app
    .use(express.static('./public'))
    .get('/', function(req, res) {
        res.sendFile(__dirname + '/public/main.html');
    });

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('complex moving', function(msg) {
        console.log('complex moving' + msg);
    })

});



http.listen(3000, function(){
    console.log('listening on *:3000');
});

