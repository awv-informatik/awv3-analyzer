import Canvas from 'awv3/core/canvas';
import View from 'awv3/core/view';

const dom = document.createElement("div");
dom.style.width = "100%";
dom.style.height = "100%";
dom.style.overflow = "hidden";

export let state = {
    url: document.location.hostname == 'localhost' ? 'http://localhost:8181' : 'http://awvr2.cloudapp.net:8080',
    filter: '',
    internal: {
        type: 'system',
        alive: true,
        errors: [],
        privateport: 0,
        publicport: 0,
        tasks: [],
        users: [],
        analyzers: [],
        sessions: []
    },
    canvas: new Canvas({ dom }),
    view: new View(),
    messages: [],
    log: [],
    code: `// Run a couple of connections
let tasks = [];
for (let i = 0; i < 1; i++) {
    tasks.push(new SocketIO().connect(startupUrl).then(connection => {

        // Clear scene
        view.scene.destroy();

        // Execute tasks and disconnect
        return connection.execute(\`

// Init tooldesigner and load tool
_C.ToolDesigner3d.InitApplication("Drawings/3dToolDesigner/3dToolDesigner.of1");
_O.ToolDesigner3d.LoadExistingTool("Drawings/ISO_Tool/Demo_Tool.of1");
RETURN _O.ToolDesigner3d.GetComponentParams("EXTENSION");

        \`)
        .then(context => addModels(context, "Task 1"))
        .then(context => connection.execute(\`

// Change extension and return new dimensions
_O.ToolDesigner3d.SetComponentParams("EXTENSION",["LB", "BD"],[150, 100]);
RETURN CADH_JSONTreeExportStr(_O.Demo_Tool);

        \`))
        .then(context => addModels(context, "Task 2"))
        .then(context => connection.disconnect());
    }));
}

log.start();
Promise.all(tasks).then(context => log.stop());

let r1 = () => Math.random() * 1000 - 500;
let r2 = () => Math.random() * 2 * Math.PI;
function addModels(context, descr = "") {
    log.printResults(descr);
    log.printResults(context.results);
    let object = new Object3(context.models)
        .setPosition(r1(), r1(), r1())
        .setRotation(r2(), r2(), r2());
    view.scene.add(object);
    view.updateBounds().controls.zoom().focus();
}`
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
