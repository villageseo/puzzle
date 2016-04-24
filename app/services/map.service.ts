import {Injectable} from 'angular2/core';

export class MapEntity {
    constructor(public x: number, public y: number) {}
}

@Injectable()
export class MapService {
    getMap() { return mapPromise; }
}

var MAP = [
    new MapEntity(0,0),
    new MapEntity(50,0),
    new MapEntity(100,0),
    new MapEntity(150,0),

    new MapEntity(0,50),
    new MapEntity(50,50),
    new MapEntity(100,50),
    new MapEntity(150,50),

    new MapEntity(0,100),
    new MapEntity(50,100),
    new MapEntity(100,100),
    new MapEntity(150,100),

    new MapEntity(0,150),
    new MapEntity(50,150),
    new MapEntity(100,150),
    new MapEntity(150,150)
];

var mapPromise = Promise.resolve(MAP);
