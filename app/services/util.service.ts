import {Injectable} from 'angular2/core';

@Injectable()
export class UtilService {
    shuffle(data) {
        let m = data.length, t, i;

        // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = data[m];
            data[m] = data[i];
            data[i] = t;
        }

        return data;
    }

    difference(a1, a2) {
        let a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    }
}
