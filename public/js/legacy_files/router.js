"use strict";

App.Router = {
    init: function() {
        var self = this;

        // Listen server state
        App.Socket.on('server-app-data', function(globalData) {
            d(globalData);

            if (globalData.client.map === undefined) {
                d('Popuplating with default data...');
                App.State = {
                    linkStartIsClicked: false,
                    player: '',
                    isEnd: false,
                    // 0 - empty, 1 - has cell
                    map: [
                        1,  1,  1,  1,
                        1,  1,  1,  1,
                        1,  1,  1,  1,
                        1,  1,  1,  0
                    ],
                    newMap: [],
                    backboneObj: {}
                }

            } else {
                App.State = globalData.client;
                console.log(globalData.client);
                d('Set App.State with global data...');
            }

            switch (globalData.server.currentRoute) {
                case 'index':
                    self.index();
                    // Update client state
                    App.Utils._updateClientAppState();
                    break;

                case 'start':
                    if (globalData.server.totalUsers == 1) {
                        self.start(false);
                    } else {
                        self.start(true);
                    }
                    break;

                case 'finish':
                    self.finish();
                    break;
            }

        });
    }
};
