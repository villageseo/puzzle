import {Injectable} from 'angular2/core';
import {UtilService} from './util.service';

export class Cell {
    constructor(
        public number: number,
        public position: number,
        public isCorrect: boolean) {}
}

@Injectable()
export class CellService {
    constructor(private _utils: UtilService) { }

    generatePuzzle() {
        let arrayMap = Array.from(Array(16).keys()),
        firstElem,
        lastElem;

        arrayMap.shift();
        arrayMap = this._utils.shuffle(arrayMap);

        if (this.isSolvable(arrayMap) == false) {
            // just swap positions of first and last element
            firstElem = arrayMap[0];
            lastElem = arrayMap[arrayMap.length-1];
            arrayMap[0] = lastElem;
            arrayMap[arrayMap.length-1] = firstElem;

            console.log('Not solvable, swap positions.. DONE.');
        }

        return arrayMap;
    }

    isSolvable(data) {
        let totalSum = 0,
            currentNumSum,
            tempArray = [],
            self = this;

        data.forEach(function(num) {
            currentNumSum = 0;
            tempArray.push(num);
            self._utils.difference(data, tempArray).forEach(function(innerNum) {
                if (num > innerNum) {
                    currentNumSum++;
                }
            });
            totalSum+=currentNumSum;
        });

        if (totalSum%2 === 0) {
            console.log('Solvable! Perfect!');
            return true;
        }
        return false;
    }

    getCells(data) {
        let curIndex = 0,
            self = this,
            itemPosition;

        let cells = new Array(15).join('-').split('-').map(function(item, index) {
            curIndex = ++index;
            itemPosition = self.getNumberPosition(curIndex, data);
            return new Cell(curIndex, itemPosition, self.isCorrectPos((curIndex - 1), itemPosition));
        });
        return Promise.resolve(cells);
    }

    isCorrectPos(index, position) {
        return index === position;
    }

    getNumberPosition(index, data) {
        if (index > 0 ) {
            return data.indexOf(index);
        }
    }
}
