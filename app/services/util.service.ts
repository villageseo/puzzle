import {Injectable} from 'angular2/core';

@Injectable()
export class UtilService {
    generateNewMap() {
        var arrayMap = [
            4,  11, 10, 3,
            13, 1,  15, 6,
            12, 5,  14, 7,
            8,  2,  9
        ];
        var firstElem, lastElem;

        arrayMap = this.shuffle(arrayMap);

        if (this.isSolvable(arrayMap) == false) {
            console.log('Not solvable, swap positions..DONE.');

            // just swap positions of first and last element
            firstElem = arrayMap[0];
            lastElem = arrayMap[arrayMap.length-1];
            arrayMap[0] = lastElem;
            arrayMap[arrayMap.length-1] = firstElem;
        }

        return arrayMap;
    }

    isSolvable(data) {
        var totalSum = 0,
            currentNumSum,
            tempArray = [],
            self = this;

        data.forEach(function(num) {
            currentNumSum = 0;
            tempArray.push(num);
            self.difference(data, tempArray).forEach(function(innerNum) {
                if (num > innerNum) {
                    currentNumSum++;
                }
            });
            console.log('num is: '+num+', currentNumSum: '+currentNumSum);
            totalSum+=currentNumSum;
        });
        console.log('Total sum is: ' +totalSum);

        if (totalSum%2 === 0) {
            console.log('Solvable! Perfect!');
            return true;
        }
        return false;
    }

    shuffle(data) {
        var m = data.length, t, i;

        // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = data[m];
            data[m] = data[i];
            data[i] = t;
        }

        return data;
    }

    difference(a1, a2) {
        var a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    };
}
