import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {BeginComponent} from './screens/begin/begin.component';
import {GameComponent} from './screens/game/game.component';

@Component({
    selector: 'my-app',
    templateUrl: '/app/templates/app.template.html',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/begin', name: 'Begin', component: BeginComponent, useAsDefault: true},
    {path: '/game', name: 'GameStart', component: GameComponent}
])
export class AppComponent { }

