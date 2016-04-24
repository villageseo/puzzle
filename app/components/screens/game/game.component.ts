import {Component, OnInit} from 'angular2/core';

import {MapEntity, MapService} from './../../../services/map.service';
import {UtilService} from './../../../services/util.service';
import {Cell, CellService} from './../../../services/cell.service';

@Component({
    selector: 'game',
    templateUrl: '/app/templates/screens/game.template.html'
})
export class GameComponent implements OnInit {
    map: MapEntity[];
    cells: Cell[];

    constructor(
        private _mapService: MapService,
        private _utilService: UtilService,
        private _cellService: CellService
    ) {}

    ngOnInit() {
        var newMap = this._utilService.generateNewMap();

        this._mapService.getMap().then(map => this.map = map);
        this._cellService.getCells(newMap).then(cells => this.cells = cells);
    }


}
