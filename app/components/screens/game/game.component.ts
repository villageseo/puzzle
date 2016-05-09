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
    mapArea: MapEntity[];
    cells: Cell[];
    player: Player;
    endGame: boolean;

    _mapMatrix = [];

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
                self._mapMatrix = map.matrix;
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

        for (var directionNumber in AppSettings.KEYBOARD) {
            nextStep = item.position + AppSettings.KEYBOARD[directionNumber];

            if (self._mapMatrix[nextStep] === 0) {
                updatePositions();

                self.updatePlayerPoints();
                self.updatePlayerSteps();
                break;
            }
        }

        function updatePositions() {
            oneCellIsMovable = true;

            self._mapMatrix[nextStep] = 1;
            self._mapMatrix[item.position] = 0;

            item.position = nextStep;

            if (nextStep === (item.number - 1)) {
                item.isCorrect = true;
            } else {
                item.isCorrect = false;
            }
        }

        /* Try complex moving */
        //if (!oneCellIsMovable) {
        //    this.tryToMoveComplex(item);
        //}
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
