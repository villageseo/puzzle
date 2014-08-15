(function() {

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        Config: {}, // constants
        State: {},  //app state vars
        Utils: {} // utils functions
    }

    App.Config = {
        DEBUG: true,
        MAX_CELLS: 15,
        MAP_AREA: [
            { x: 0,  y: 0   }, { x: 50, y: 0   }, { x: 100, y: 0   }, { x: 150, y: 0   },

            { x: 0,  y: 50  }, { x: 50, y: 50  }, { x: 100, y: 50  }, { x: 150, y: 50  },

            { x: 0,  y: 100 }, { x: 50, y: 100 }, { x: 100, y: 100 }, { x: 150, y: 100 },

            { x: 0,  y: 150 }, { x: 50, y: 150 }, { x: 100, y: 150 }, { x: 150, y: 150 }
        ],
        NUMBERS_MOVE: {
            TOP: -4,
            RIGHT: 1,
            BOTTOM: 4,
            LEFT: -1
        }
    };

    App.State = {
        player: '',
        isEnd: false,
        // 0 - empty, 1 - has cell
        map: [
            1,  1,  1,  1,
            1,  1,  1,  1,
            1,  1,  1,  1,
            1,  1,  1,  0
        ],
        newMap: []
    };

    //some useful global functions
    window.template = function(id) {
        return _.template($('#'+id).html());
    }

    window.d = function(what) {
        if (App.Config.DEBUG) {
            if (console && console.log) {
                console.log(what);
            }
        }
    }

    // MODELS
    /************/
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

    // COLLECTIONS
    /************/
    App.Collections.Cell = Backbone.Collection.extend({
        model: App.Models.Cell
    });

    // VIEWS
    /************/
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
        }
    });

    App.Views.Cell = Backbone.View.extend({
        initialize: function() {
            this.model.on("change", this.render, this);
            //this.model.on("destroy", this.remove, this);
        },
        tagName: 'div',
        className: 'puzzle__item',

        template: template('template-puzzle-cell-item'),

        render: function() {
            var model = this.model.attributes;
            var curPos = model.position;

            this.$el.animate({
                'left': App.Config.MAP_AREA[curPos].x,
                'top': App.Config.MAP_AREA[curPos].y
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
            var curModel = this.model;
            var curPos = curModel.attributes.position;
            var curNumber = curModel.attributes.number;
            var nextStep;
            var canBeMoved = canBeMovedChecker();
            var oneCellIsMovable = false;

            _.each(App.Config.NUMBERS_MOVE, function(directionNumber) {
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
        },
        tryToMoveComplex: function(curModel) {
            var curPos = curModel.attributes.position;
            var nearestCellPos;
            var closestCellPos;
            var nullCellPos = _.indexOf(App.State.map, 0);
            var canBeMovedComplex;

            d('Trying COMPLEX moving..');

            _.each(App.Config.NUMBERS_MOVE, function(directionNumber) {
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

                d('-----------Номер движения: '+directionNumber+'---------------');
                d('Позиция curPos: '+curPos);
                d('Позиция nearest: '+nearestCellPos);
                d('Позиция closest: '+closestCellPos);
                d('Позиция null: '+nullCellPos);
                d('Шаг: '+currentStep);

                // Exceptions when try complex moving..
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
        }
    });

    App.Views.PlayerPoints = Backbone.View.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
            this.render();
        },
        template: template('template-points'),
        render: function() {
            var model = this.model.attributes;
            this.$el.html(this.template(model));
        }
    });

    App.Views.PlayerSteps = Backbone.View.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
            this.render();
        },
        template: template('template-steps'),
        render: function() {
            var model = this.model.attributes;
            this.$el.html(this.template(model));
        }
    });

    // ROUTERS
    /************/
    App.Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'start': 'start',
            finish: 'finish'
        },
        index: function() {
            var wrap = $('#puzzle-wrap');
            var indexTemplate = template('template-index-page');
            var hud = $('#puzzle-hud');

            d('Index route..');

            hud.slideUp({
                duration: 500,
                queue: false
            });

            wrap.empty();
            wrap.slideDown({
                duration: 1000,
                easing: 'easeOutBounce',
                queue: false
            });
            wrap.html(indexTemplate);
            App.Utils.timer.end();
        },
        start: function() {
            var wrap = $('#puzzle-wrap');
            var hud = $('#puzzle-hud');
			var timerHud = $('#puzzle-hud-timer-inner');

            var startTemplate = template('template-puzzle-container');

            d('Start route..');
			wrap.fadeIn(1000);
            wrap.html(startTemplate);
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
                    App.State.init();
                },
                queue: false
            })
        },
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
    });


    // Init function
    /************/
    App.State.init = function() {
        var cellCurrent;
        var cellsArray = [];

        var CellCollection = new App.Collections.Cell();
        var i;

        // generate new puzzle
        App.State.newMap = App.Utils.generateNewMap();

        // create player
        var player = new App.Models.Player();
        App.State.player = player;

        //populate with cell items
        for (i=1; i <= App.Config.MAX_CELLS; i++) {
            cellCurrent = new App.Models.Cell({
                number: i,
                position: App.Utils.getNumberPosition(i)
            });
            cellsArray.push(cellCurrent);
        }

        var cellCollectionView = new App.Views.CellCollection({
            collection : CellCollection,
            el : $('#puzzle-container')[0]
        });
        CellCollection.add(cellsArray);

        var playerStepsView = new App.Views.PlayerSteps({
            model: player,
            el: $('#puzzle-hud-steps-inner')[0]
        })

        var playerPointsView = new App.Views.PlayerPoints({
            model: player,
            el: $('#puzzle-hud-points-inner')[0]
        })

    };

    App.Utils = {
        generateNewMap: function() {
            var arrayMap = [
                4,  11, 10, 3,
                13, 1,  15, 6,
                12, 5,  14, 7,
                8,  2,  9
            ];
            var firstElem, lastElem;

            arrayMap = _.shuffle(arrayMap)

            if (this.isSolvable(arrayMap) == false) {
                d('Not solvable, swap positions..DONE.');

                // just swap positions of first and last element
                firstElem = arrayMap[0];
                lastElem = arrayMap[arrayMap.length-1];
                arrayMap[0] = lastElem;
                arrayMap[arrayMap.length-1] = firstElem;
            }

            return arrayMap;
        },
        isSolvable: function(arrayMap) {
            var totalSum = 0;
            var currentNumSum;
            var tempArray = [];

            if (_.isArray(arrayMap)) {
                _.each(arrayMap, function(num) {
                    currentNumSum = 0;
                    tempArray.push(num);
                    _.each(_.difference(arrayMap, tempArray), function(innerNum) {
                       if (num > innerNum) {
                           currentNumSum++;
                       }
                    });
                    d('num is: '+num+', currentNumSum: '+currentNumSum);
                    totalSum+=currentNumSum;
                });

                d('Total sum is: ' +totalSum);

                if (totalSum%2 === 0) {
                    d('Solvable! Perfect!');
                    return true;
                }
            }
            return false;
        },
        getNumberPosition: function(number) {
            if (number > 0 ) {
                return _.indexOf(App.State.newMap, number);
            } else {
                throw new Error("Число должно быть больше 1!");
            }
        },
        timer: {
            intervalID: 0,
            template: template('template-timer'),
            timeItems: [
                { left: 0, right: 0, type: 'hours'   },
                { left: 0, right: 0, type: 'minutes' },
                { left: 0, right: 0, type: 'seconds' }
            ],
            start: function() {
                var self = this;

                self.render();

                this.intervalID = setInterval(function() {
                    self.updateTime();
                }, 1000);
            },
            updateTime: function() {
                var self = this;
                var hours = self.timeItems[0];
                var minutes = self.timeItems[1];
                var seconds = self.timeItems[2];


                // Update seconds
                if (seconds.right < 9) {
                    seconds.right++;
                } else {
                    seconds.right = 0;
                    seconds.left++;
                }

                // Update to minute
                if (seconds.left == 6) {
                    seconds.left = 0;
                    seconds.right = 0;

                    if (minutes.right < 9) {
                        minutes.right++;
                    } else {
                        minutes.right = 0;
                        minutes.left++;
                    }
                }

                // Update to hour
                if (minutes.left == 6) {
                    minutes.left = 0;
                    minutes.right = 0;

                    if (hours.right < 9) {
                        hours.right++;
                    } else {
                        hours.right = 0;
                        hours.left++;
                    }
                }

                self.render();
            },
            render: function() {
                var container = $('#puzzle-hud-timer-inner');
                container.html(this.template({items:this.timeItems}));
            },
            makeTimerNull: function() {
                _.each(this.timeItems, function(item) {
                    item.left = 0;
                    item.right = 0;
                })
            },
            end: function() {
                clearInterval(this.intervalID);
                d('Timer ended..');
            }
        }
    };


    // Start Backbone
    /************/
    new App.Router;
    Backbone.history.start();

})();

