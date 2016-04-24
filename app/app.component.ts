import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {BeginComponent} from './components/screens/begin/begin.component';
import {GameComponent} from './components/screens/game/game.component';
import {FinishComponent} from './components/screens/finish/finish.component';

import {MapService} from './services/map.service';
import {UtilService} from './services/util.service';
import {CellService} from './services/cell.service';

@Component({
    selector: 'my-app',
    templateUrl: '/app/templates/app.template.html',
    providers: [MapService, UtilService, CellService],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/begin', name: 'Begin', component: BeginComponent, useAsDefault: true},
    {path: '/game', name: 'GameStart', component: GameComponent},
    {path: '/finish', name: 'Finish', component: FinishComponent}
])
export class AppComponent { }

