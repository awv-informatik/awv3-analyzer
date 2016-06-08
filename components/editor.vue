<style lang="sass">

@import 'theme'
@import 'codemirror/lib/codemirror'
@import 'codemirror/theme/3024-day'

.editor-container
    position: relative
    width: 100%
    height: 100%

#editor-code
    position: absolute
    left: 0
    width: 60%
    height: 100%
    overflow: hidden

div.CodeMirror
    height: 100%
    font-size: 12px

#editor-side
    position: absolute
    left: 60%
    width: 40%
    height: 100%
    display: flex
    flex-direction: column

.editor-view
    background-color: material-color('grey', '200')
    overflow: hidden
    flex: 1

.editor-results
    background-color: material-color('grey', '300')
    flex: 1
    font-family: 'Source Code Pro', monospace
    font-size: 12px
    margin: 0
    padding: 0
    overflow-y: auto
    overflow-x: hidden

.editor-results p, span
    margin: 0
    padding: 0

.editor-results p
    margin-bottom: 10px

.alertify-logs
    z-index: 1000

</style>

<template>

<div class="editor-container">

    <div id="editor-side">
        <div class="editor-view swoosh {{active ? 'active' : ''}}"></div>
        <div class="editor-results">
            <p v-for="result in results" track-by="$index">
                {{result}}
            </p>
        </div>
    </div>
    <div id="editor-code">
        <textarea id="editor" name="code"></textarea>
    </div>
</div>

</template>

<script>

import { state } from './store';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import alertify from 'alertify.js'
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/selection/active-line.js';

const content = `// Run a couple of connections
let tasks = [];
for (let i = 0; i < 1; i++) {
    tasks.push(new SocketIO().connect("${state.url}").then(connection => {

        // Clear scene
        view.scene.destroy();

        // Execute tasks and disconnect
        return connection.execute(\`

// Init tooldesigner and load tool
_C.ToolDesigner3d.InitApplication("Drawings/3dToolDesigner/3dToolDesigner.of1");
_O.ToolDesigner3d.LoadExistingTool("Drawings/ISO_Tool/Demo_Tool.of1");

        \`)
        .then(context => addModels(context))
        .then(context => connection.execute(\`

// Change extension and return new dimensions
_O.ToolDesigner3d.SetComponentParams("EXTENSION",["LB", "BD"],[150, 100]);
RETURN _O.ToolDesigner3d.GetComponentParams("EXTENSION");

        \`))
        .then(context => addModels(context))
        .then(context => connection.disconnect());
    }));
}

log.start();
Promise.all(tasks).then(context => log.stop());

let r1 = () => Math.random() * 1000 - 500;
let r2 = () => Math.random() * 2 * Math.PI;
function addModels(context) {
    log.print(context.results);
    let object = new Object3(context.models)
        .setPosition(r1(), r1(), r1())
        .setRotation(r2(), r2(), r2());
    view.scene.add(object);
    view.updateBounds().controls.zoom().focus();
}`;

export default {
    data: () => ({
        active: false,
        results: []
    }),
    route: {
        data() {
            this.refresh();
        },
        activate() {
            document.addEventListener("keydown", this.listen, false);
        },
        deactivate() {
            document.removeEventListener("keydown", this.listen, false);
        }
    },
    compiled() {
        // Append view
        this.$el.querySelector(".editor-view").appendChild(state.canvas.dom);

    },
    ready() {
        // Create editor
        if (!!!this.editor) this.editor = CodeMirror.fromTextArea(this.$el.querySelector("#editor"), {
            lineNumbers: true,
            theme: "3024-day",
            indentUnit: 4,
            lineWrapping: true,
            matchBrackets: true,
            styleActiveLine: true,
            mode: "javascript"
        });

        // Fetch code, either from the browsers local storage or the default
        let value = localStorage.getItem('awv3-analyzer-editor-content') || content;
        this.editor.setValue(value);
        alertify.log("Hit ctrl-s to compile, ctrl-r to reset");

        window.SocketIO = SocketIO;
        window.Object3 = Object3;
        window.canvas = state.canvas;
        window.view = state.view;
        window.log = this;

        this.refresh();
    },
    methods: {
        refresh() {
            setTimeout(_ => {
                state.canvas.renderer.resize();
                state.canvas.renderer.invalidateViews(60);
            }, 20);
        },
        start() {
            this.active = true;
            this.results = [];
        },
        stop() {
            this.active = false;
        },
        print(context) {
            if (Array.isArray(context))
                context.forEach(item => this.results.push(JSON.stringify(item.result)));
            else if (typeof context === 'object')
                this.results.push(JSON.stringify(context));
            else
                this.results.push(context);
        },
        listen(e) {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {

                // Save: ctrl-s
                e.preventDefault();
                try {

                    // Get code from editor and compile using eval
                    let value = this.editor.getValue();
                    eval(value);

                    // It compiled! Store the code in the browsers local storage and notify
                    alertify.success("Compiled sucessfully");
                    localStorage.setItem('awv3-analyzer-editor-content', value);

                } catch (reason) {
                    alertify.error(reason);
                }

            } else if (e.keyCode == 82 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {

                // Reset: ctrl-r
                e.preventDefault();
                localStorage.removeItem('awv3-analyzer-editor-content');
                this.editor.setValue(content);
                alertify.log("Content has been reset");
            }
        }
    }
}

</script>
