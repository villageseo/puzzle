"use strict";


App.Models.Cell =  Backbone.Model.extend({
    defaults: {
        number: 0,
        position: 0,
        isCorrect: false
    }
});

App.Models.Player = Backbone.Model.extend({
    defaults: {
        points: 0,
        steps: 0
    }
});

