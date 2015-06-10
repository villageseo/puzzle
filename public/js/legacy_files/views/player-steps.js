"use strict";

App.Views.PlayerSteps = Backbone.View.extend({
    initialize: function() {
        this.model.on('change', this.render, this);
        this.render();
    },
    template: template('template-steps'),
    render: function() {
        var model = this.model.attributes;
        this.$el.html(this.template(model));
        App.Utils._updateClientAppState();
    }
});
