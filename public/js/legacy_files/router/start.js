"use strict";

App.Router = {
    start: function(started) {
        var wrap = $('#puzzle-wrap');
        var hud = $('#puzzle-hud');
        var timerHud = $('#puzzle-hud-timer-inner');
        var startTemplate = template('template-puzzle-container');

        wrap
            .fadeIn(1000)
            .html(startTemplate);

        App.Utils.timer.makeTimerNull();
        timerHud.hide();

        $('#puzzle-container').slideDown({
            duration: 1500,
            done: function() {
                App.Utils.timer.start();
                timerHud.show();
                hud.fadeIn({
                    duration: 1200
                });
                App.bootstrap(started);
            },
            queue: false
        })
    }
};
