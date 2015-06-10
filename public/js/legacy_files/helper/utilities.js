"use strict";

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

        if (this._isSolvable(arrayMap) == false) {
            d('Not solvable, swap positions..DONE.');

            // just swap positions of first and last element
            firstElem = arrayMap[0];
            lastElem = arrayMap[arrayMap.length-1];
            arrayMap[0] = lastElem;
            arrayMap[arrayMap.length-1] = firstElem;
        }

        return arrayMap;
    },

    getNumberPosition: function(number) {
        if (number > 0 ) {
            return _.indexOf(App.State.newMap, number);
        } else {
            throw new Error("Число должно быть больше 1!");
        }
    },

    _isSolvable: function(arrayMap) {
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

    _updateClientAppState: function() {
        App.Socket.emit('client-app-data', App.State);
    },

    // Pretty simple timer :)
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

            // Update minutes
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

            // Update hours
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
}

// Some useful global functions
window.template = function(id) {
    return _.template($('#'+id).html());
}

window.d = function(what) {
    if (App.Options.debugClient) {
        if (console && console.log) {
            console.log(what);
        }
    }
}


