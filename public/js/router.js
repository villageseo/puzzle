
define([
    'jquery',
    'underscore',
    'socketio',
    'text!../templates/index_view.html'
], function($, _, io, indexViewTemplate) {

    var defaultClientData = {
        linkStartIsClicked: false,
        player: '',
        isEnd: false,
        map: [
            1,  1,  1,  1,
            1,  1,  1,  1,
            1,  1,  1,  1,
            1,  1,  1,  0  // 0 - empty, 1 - has cell
        ],
        newMap: [],
        backboneObj: {}
    };
    var socket = io.connect('http://localhost:3000');

    var init = function() {
        // Listen server state
        socket.on('server-app-data', function(globalData) {

            if (globalData.client.map === undefined) {
                console.log('undefined data...');
                socket.emit('client-app-data', defaultClientData);
            }

            switch (globalData.server.currentRoute) {
                case 'index':
                    indexRouter();
                    break;

                case 'start':
                    //startRouter();
                    break;

                case 'finish':
                    //finishRouter();
                    break;
            }
        });
    }

    function indexRouter() {
        var wrap = $('#puzzle-wrap'),
            hud = $('#puzzle-hud'),
            startLink,
            indexViewTemplateData = {},
            indexViewTemplateCompiled = _.template(indexViewTemplate, indexViewTemplateData);

        hud.slideUp({
            duration: 500,
            queue: false
        });

        wrap.empty().slideDown({
            duration: 1000,
            //easing: 'easeOutBounce',
            queue: false
        });

        wrap.html(indexViewTemplateCompiled);
        //App.Utils.timer.end();
        startLink = $('#puzzle-start-link');

        startLink.on('click', function() {
            socket.emit('client-app-data', {
                linkStartIsClicked: true
            });
        })
    }

    return {
        init: init
    };
});
