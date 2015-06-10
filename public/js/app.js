
define([
    'domReady',
    'router',
], function(domReady, Router) {

    var init = function() {
        domReady(function () {
            Router.init();
        })
    }

    return {
        init: init
    };
});
