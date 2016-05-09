export class Player {
    id: number;
    points: number;
    steps: number;

    constructor(id: number, points: number, steps: number) {
        this.id = id;
        this.points = points;
        this.steps = steps;
    }
}