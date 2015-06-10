"use strict";


App.Views.Cell = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);
    },
    tagName: 'div',
    className: 'puzzle__item',

    template: template('template-puzzle-cell-item'),

    render: function() {
        var model = this.model.attributes;
        var curPos = model.position;

        this.$el.animate({
            'left': App.Constants.MAP_AREA[curPos].x,
            'top': App.Constants.MAP_AREA[curPos].y
        }, {
            duration: 280,
            queue: false,
            easing: "easeOutCubic"
        });

        this.$el.html(this.template(model));
        return this;
    },
    events: {
        'click': 'tryToMoveOneCell'
    },
    tryToMoveOneCell: function() {
        var curModel = this.model,
            curPos = curModel.attributes.position,
            curNumber = curModel.attributes.number,
            nextStep,
            canBeMoved = canBeMovedChecker(),
            oneCellIsMovable = false;

        _.each(App.Constants.NUMBERS_MOVE, function(directionNumber) {
            nextStep = curPos + directionNumber;

            if (App.State.map[nextStep] == 0 && canBeMoved) {
                updatePositions();
            }
        });

        function canBeMovedChecker() {
            var nullPos = _.indexOf(App.State.map, 0);
            var wall = [0, 3, 4, 7, 8, 11, 12, 15];
            var nullIndexOf = _.indexOf(wall, nullPos);
            var cellIndexOf = _.indexOf(wall, curPos);

            if (nullIndexOf != -1 && cellIndexOf != -1) {
                if ((curPos-1) == nullPos ) {
                    return false;
                } else if ((curPos+1) == nullPos) {
                    return false;
                }
            }
            return true;
        }

        function updatePositions() {
            var steps = App.State.player.get('steps') + 1;

            oneCellIsMovable = true;
            App.State.map[nextStep] = 1;
            App.State.map[curPos] = 0;

            curModel.set('position', nextStep);
            App.State.player.set('steps', steps);

            if (nextStep == curNumber-1) {
                curModel.set('isCorrect', true);
            } else {
                curModel.set('isCorrect', false);
            }
        }

        /* Try complex moving */
        if (oneCellIsMovable == false) {
            this.tryToMoveComplex(curModel);
        }

        // Update client state
        App.Utils._updateClientAppState();
    },
    tryToMoveComplex: function(curModel) {
        var curPos = curModel.attributes.position;
        var nearestCellPos;
        var closestCellPos;
        var nullCellPos = _.indexOf(App.State.map, 0);
        var canBeMovedComplex;

        d('Trying COMPLEX moving..');

        _.each(App.Constants.NUMBERS_MOVE, function(directionNumber) {
            closestCellPos = curPos + directionNumber;

            // click second cell from empty
            if ((closestCellPos + directionNumber == nullCellPos)) {
                canBeMovedComplex = canBeMovedComplexChecker(directionNumber, true);
                if (canBeMovedComplex) {
                    $('.puzzle__item__cell[data-position='+closestCellPos+']').trigger('click');
                    $('.puzzle__item__cell[data-position='+curPos+']').trigger('click');
                }

            } else {
                // click third cell from empty
                closestCellPos = curPos + directionNumber*2;
                nearestCellPos = curPos + directionNumber;

                if ((closestCellPos + directionNumber == nullCellPos)) {
                    canBeMovedComplex = canBeMovedComplexChecker(directionNumber, false);

                    // ToDo: Bad logic (must be refactored)
                    if (canBeMovedComplex) {
                        $('.puzzle__item__cell[data-position='+closestCellPos+']').trigger('click');
                        $('.puzzle__item__cell[data-position='+nearestCellPos+']').trigger('click');
                        $('.puzzle__item__cell[data-position='+curPos+']').trigger('click');
                    }
                }
            }
        });

        function canBeMovedComplexChecker(directionNumber, currentStep) {
            var wall = [0, 3, 4, 7, 8, 11, 12, 15];
            var currentStep = currentStep ? 'step2' : 'step3';

            d('-----------Direction Number: '+directionNumber+'---------------');
            d('curPos: '+curPos);
            d('Position nearest: '+nearestCellPos);
            d('Position closest: '+closestCellPos);
            d('Position null: '+nullCellPos);
            d('Step: '+currentStep);

            // Forbidden movings
            switch (currentStep) {
                case 'step2':
                    if ((_.indexOf(wall, closestCellPos) != -1) && (_.indexOf(wall, curPos) == -1)) {
                        d('NOTICE! Not allowed Step (2.1)');
                        return false;
                    }
                    if ((_.indexOf(wall, curPos)) != -1 && (_.indexOf(wall, closestCellPos) != -1) && (Math.abs(directionNumber) != 4)) {
                        d('NOTICE! Not allowed Step (2.2)');
                        return false;
                    }
                    break;
                case 'step3':
                    if ((_.indexOf(wall, closestCellPos) != -1) && (_.indexOf(wall, nearestCellPos) == -1) && _.indexOf(wall, curPos) == -1) {
                        d('NOTICE! Not allowed Step (3.1)');
                        return false;
                    }
                    if ((_.indexOf(wall, curPos) != -1) && (_.indexOf(wall, nearestCellPos) != -1) && (_.indexOf(wall, closestCellPos) == -1)) {
                        d('NOTICE! Not allowed Step (3.2)');
                        return false;
                    }
                    if ((_.indexOf(wall, curPos)) == -1 && (_.indexOf(wall, nearestCellPos) != -1) && (_.indexOf(wall, closestCellPos) != -1)) {
                        d('NOTICE! Not allowed Step (3.3)');
                        return false;
                    }
                    break;
            }
            return true;
        }

        App.Utils._updateClientAppState();
    }
});
