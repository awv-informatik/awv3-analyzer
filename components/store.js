import Canvas from 'awv3/core/canvas';
import View from 'awv3/core/view';

const dom = document.createElement("div");
dom.style.width = "100%";
dom.style.height = "100%";
dom.style.overflow = "hidden";

export function internal() {
    return {
        type: 'system',
        alive: true,
        errors: [],
        privateport: 0,
        publicport: 0,
        tasks: [],
        users: [],
        analyzers: [],
        sessions: []
    }
}

export let state = {
    internal: internal(),
    canvas: new Canvas({ dom }),
    view: new View(),
    messages: [],
    log: []
};

export function createCluster(which) {
    let root = Math.round(Math.sqrt(state.internal[which].length));
    let result = [];
    let index = 0;
    while (index < state.internal[which].length) {
        let row = [];
        result.push(row);
        for (let r = 0; r < root; r++) {
            let item = state.internal[which][index++];
            if (item) {
                row.push(item)
            } else {
                break;
            }
        }
    }
    return result;
}
