
require.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        socketio: 'https://cdn.socket.io/socket.io-1.3.5'
    }

});

require([
    'app',
], function(App){
    App.init();
});
