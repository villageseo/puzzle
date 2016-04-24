import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {BeginComponent} from './components/screens/begin/begin.component';
import {GameComponent} from './components/screens/game/game.component';
import {FinishComponent} from './components/screens/finish/finish.component';

@Component({
    selector: 'my-app',
    templateUrl: '/app/templates/app.template.html',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/begin', name: 'Begin', component: BeginComponent, useAsDefault: true},
    {path: '/game', name: 'GameStart', component: GameComponent},
    {path: '/finish', name: 'Finish', component: FinishComponent}
])
export class AppComponent { }

