"use strict";


App.Views.CellCollection = Backbone.View.extend({
    initialize: function() {
        this.collection.on('add', this.addCell, this);
        this.collection.on('change', this.checkWin, this);
    },

    render: function() {
        this.collection.each(this.addCell, this);
        return this;
    },

    addCell: function(cell) {
        var cellView = new App.Views.Cell({model: cell});
        this.$el.append(cellView.render().el);
        App.Utils._updateClientAppState();
    },

    checkWin: function() {
        var isEnd = true;
        var points = 0;

        // check all models for ending game && adding points
        _.each(this.collection.models, function(curModel) {
            if (curModel.attributes.isCorrect == false) {
                isEnd = false;
            } else {
                points+=50;
            }
        });

        App.State.player.set('points', points);

        if (isEnd) {
            App.State.isEnd = isEnd;
            window.location.hash = '#finish';
        }
        App.Utils._updateClientAppState();
    }

});
