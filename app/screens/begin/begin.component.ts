import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'begin',
    templateUrl: '/app/templates/screens/begin.template.html'
})
export class BeginComponent {
    constructor(
        private _router:Router){}

    startGame() {
        this._router.navigate(['GameStart',  {} ]);
    }
}
