"use strict";

App.Constants = {
    MAX_CELLS: 15,
    MAP_AREA: [
        { x: 0,  y: 0   }, { x: 50, y: 0   }, { x: 100, y: 0   }, { x: 150, y: 0   },
        { x: 0,  y: 50  }, { x: 50, y: 50  }, { x: 100, y: 50  }, { x: 150, y: 50  },
        { x: 0,  y: 100 }, { x: 50, y: 100 }, { x: 100, y: 100 }, { x: 150, y: 100 },
        { x: 0,  y: 150 }, { x: 50, y: 150 }, { x: 100, y: 150 }, { x: 150, y: 150 }
    ],
    NUMBERS_MOVE: {
        TOP: -4,
        RIGHT: 1,
        BOTTOM: 4,
        LEFT: -1
    }
};
