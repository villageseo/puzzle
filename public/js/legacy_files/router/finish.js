"use strict";

App.Router = {
    finish: function() {
        var wrap = $('#puzzle-wrap');
        var endTemplate = template('template-ending');

        wrap.fadeOut({
            duration: 2200,
            done: function() {
                wrap.empty().html(endTemplate).fadeIn(1500);
            }
        });

        d('The end..');
        App.Utils.timer.end();
    }
};
