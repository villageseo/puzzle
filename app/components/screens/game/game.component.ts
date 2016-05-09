import {Component, OnInit} from 'angular2/core';

import {Player} from './../../../classes/player';
import {AppSettings} from './../../../constants/appSettings';

import {MapEntity, MapService} from './../../../services/map.service';
import {Cell, CellService} from './../../../services/cell.service';

@Component({
    selector: 'game',
    templateUrl: '/app/templates/screens/game.template.html'
})
export class GameComponent implements OnInit {
    mapMatrix = [];
    mapArea: MapEntity[];

    cells: Cell[];
    player: Player;

    endGame: boolean;

    constructor(
        private _mapService: MapService,
        private _cellService: CellService
    ) {}

    ngOnInit() {
        let puzzle = this._cellService.generatePuzzle(),
            self = this;

        self.endGame = false;

        // Create map
        this._mapService.getMap()
            .then(function(map) {
                self.mapArea = map.area;
                self.mapMatrix = map.matrix;
            });

        // Create cells
        this._cellService.getCells(puzzle)
            .then(cells => this.cells = cells);

        // Create player
        self.player = new Player(1, 0, 0);
    }

    tryToMoveOneCell(item) {
        let nextStep,
            oneCellIsMovable = false,
            self = this;

        console.log('tryToMoveOneCell');

        for (var direction in AppSettings.DIRECTIONS) {
            nextStep = item.position + AppSettings.DIRECTIONS[direction];

            if (self.mapMatrix[nextStep] === 0) {
                updatePositions();

                self.updatePlayerPoints();
                self.updatePlayerSteps();
                break;
            }
        }

        function updatePositions() {
            oneCellIsMovable = true;

            self.mapMatrix[nextStep] = 1;
            self.mapMatrix[item.position] = 0;

            item.position = nextStep;

            if (nextStep === (item.number - 1)) {
                item.isCorrect = true;
            } else {
                item.isCorrect = false;
            }
        }

        /* Try complex moving */
        if (!oneCellIsMovable) {
            this.tryToMoveComplex(item);
        }
    }

    tryToMoveComplex(item) {
        var zeroPosition,
            lastPos,
            maxDepth = 3,
            curDepth,
            cellsToMove = [];

        for (var direction in AppSettings.DIRECTIONS) {
            if (direction === 'bottom') {
                //zeroPosition = this.getZeroPosition();
                //
                //lastPos = item.position + (maxDepth*AppSettings.DIRECTIONS[direction]);
                //
                //for (curDepth = 1; curDepth <= maxDepth; curDepth++) {
                //    lastPos -= AppSettings.DIRECTIONS[direction];
                //    cellsToMove.push(this.getCellByPosition(lastPos));
                //
                //    console.log('curDepth: ' + curDepth);
                //    console.log(lastPos);
                //}
                //
                //console.log(cellsToMove);
            }
        }
    }

    getCellByPosition(position) {
        let cell:any = false;

        this.cells.forEach(function(item) {
           if (item.position == position) {
               cell = item;
           }
        });

        return cell;
    }

    getZeroPosition() {
        return this.mapMatrix.indexOf(0);
    }

    updatePlayerPoints() {
        var points = 0;

        this.cells.forEach(function(item) {
            if (item.isCorrect) {
                points += 50;
            }
        });

        this.player.points = points;
    }

    updatePlayerSteps() {
        this.player.steps += 1;
    }
}
