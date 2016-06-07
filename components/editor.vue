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

.alertify-logs
    z-index: 1000

</style>

<template>

<div class="editor-container">

    <div id="editor-side">
        <div class="editor-view"></div>
        <div class="editor-results swoosh active"></div>
    </div>
    <div id="editor-code">
        <textarea id="editor" name="code"></textarea>
    </div>
</div>

</template>

<script>

import { state }
from './store';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import alertify from 'alertify.js'
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/selection/active-line.js';

export default {
    data: () => ({ }),
    compiled() {
        this.$el.querySelector(".editor-view").appendChild(state.canvas.dom);
    },
    ready() {

        let editor = CodeMirror.fromTextArea(this.$el.querySelector("#editor"), {
            lineNumbers: true,
            theme: "3024-day",
            indentUnit: 4,
            lineWrapping: true,
            matchBrackets: true,
            styleActiveLine: true,
            mode: "javascript"
        });

        let text = `
// Create a couple of connections
for (let i = 0; i < 1; i++) {
    new SocketIO().connect('http://awvr2.cloudapp.net:8080').then(connection => {

        // Create a promise-chain
        let promise = Promise.resolve();

        // First task
        promise = promise.then( _ => {
            console.log("running first task")
            return connection.execute(\`

_C.ToolDesigner3d.InitApplication("Drawings/3dToolDesigner/3dToolDesigner.of1");
_O.ToolDesigner3d.LoadExistingTool("Drawings/ISO_Tool/Demo_Tool.of1");

        \`).then(context => addModels(context.models))});

        // Second task
        promise = promise.then( _ => {
            console.log("running second task")
            return connection.execute(\`

_O.ToolDesigner3d.SetComponentParams("EXTENSION",["LB", "BD"],[150, 100]);
_O.ToolDesigner3d.GetComponentParams("EXTENSION");

        \`).then(context => addModels(context.models))});

        // Disconnect client ...
        promise = promise.then( _ => connection.disconnect());
    });
}

function addModels(context) {
    let object = new Object3(context)
        .setPosition(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 500)
        .setRotation(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
    state.view.scene.add(object);
    state.view.updateBounds().controls.zoom().focus();
}`;

        editor.setValue(text);
        alertify.log("Hit ctrl-s to compile!");

        window.SocketIO = SocketIO;
        window.Object3 = Object3;
        window.state = state;

        document.addEventListener("keydown", e => {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                try {
                    eval(editor.getValue());
                    alertify.success("Compiled sucessfully");
                } catch (reason) {
                    alertify.error(reason);
                    console.error(reason);
                }
            }
        }, false);

        state.canvas.renderer.resize();
        state.canvas.renderer.invalidateViews(60);
    }
}

</script>
