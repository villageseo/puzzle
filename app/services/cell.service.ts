import {Injectable} from 'angular2/core';

export class Cell {
    constructor(
        public number: number,
        public position: number,
        public isCorrect: boolean) {}
}

@Injectable()
export class CellService {
    getCells(data) {
        var curIndex = 0;
        var self = this;

        var CELLS = new Array(15).join('-').split('-').map(function(item, index) {
            curIndex = ++index;
            return new Cell(curIndex, self.getNumberPosition(curIndex, data), false);
        });
        console.log(CELLS);
        return Promise.resolve(CELLS);
    }

    tryToMoveOneCell() {
        console.log('tryToMoveOneCell');
    }

    tryToMoveComplex() {
        console.log('tryToMoveComplex');
    }

    getNumberPosition(index, data) {
        if (index > 0 ) {
            return data.indexOf(index);
        }
    }
}
