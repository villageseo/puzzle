"use strict";

App.bootstrap = function(started) {
    var started = started || false;
    var cellCurrent;
    var cellsArray = [];
    var i;

    // New game

    d('started' + started);
    if (started == false) {
        App.State.newMap = App.Utils.generateNewMap();
        App.State.backboneObj.CellCollection = new App.Collections.Cell();

        // create player
        App.State.player = new App.Models.Player();

        //populate with cell items
        for (i=1; i <= App.Constants.MAX_CELLS; i++) {
            cellCurrent = new App.Models.Cell({
                number: i,
                position: App.Utils.getNumberPosition(i)
            });
            cellsArray.push(cellCurrent);
        }

        App.State.backboneObj.cellCollectionView = new App.Views.CellCollection({
            collection : App.State.backboneObj.CellCollection,
            el : $('#puzzle-container')[0]
        });

        App.State.backboneObj.CellCollection.add(cellsArray);

        App.State.backboneObj.playerStepsView = new App.Views.PlayerSteps({
            model: App.State.player,
            el: $('#puzzle-hud-steps-inner')[0]
        })

        App.State.backboneObj.playerPointsView = new App.Views.PlayerPoints({
            model: App.State.player,
            el: $('#puzzle-hud-points-inner')[0]
        })
    } else {

    }

    // Update client state
    App.Utils._updateClientAppState();
};
