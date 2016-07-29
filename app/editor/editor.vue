<style lang="sass">

@import './../theme'
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
    overflow-y: auto
    background-color: #f7f7f7

div.CodeMirror
    margin: 60px
    height: initial
    font-size: 12px

.cm-s-3024-day span.cm-string
    color: #ff9800

#editor-side
    position: absolute
    left: 60%
    width: 40%
    height: 100%
    display: flex
    flex-direction: column

.editor-view
    position: relative
    background-color: #cce2d7
    overflow: hidden
    flex: 1

.editor-results
    background-color: #efefef
    flex: 2
    font-family: 'Source Code Pro', monospace
    font-size: 12px
    margin: 0
    padding: 60px
    overflow-y: auto
    overflow-x: hidden

.alertify-logs
    z-index: 1000

ul
    padding-left: 1em
    list-style-type: none

</style>

<template>

<div class="editor-container">
    <div id="editor-side">
        <div class="editor-view"></div>
        <div class="editor-results cm-s-3024-day">
            <ul><json-tree :model="treeData" :open="true"></json-tree></ul>
        </div>
    </div>
    <div id="editor-code">
        <textarea id="editor"></textarea>
    </div>
</div>

</template>

<script>

import Vue from 'vue';
import { state } from './../store';
import JsonTree from './jsontree.vue';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import Rest from 'awv3/communication/rest';
import alertify from 'alertify.js'
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/selection/active-line.js';

let editor = undefined;

export default {
    components: { 'json-tree': JsonTree },
    data: () => ({
        active: false,
        treeData: []
    }),
    route: {
        data() {
            this.refresh();
        }
    },
    created() {
        window.addEventListener("keydown", this.listen);
    },
    compiled() {
        this.$el.querySelector(".editor-view").appendChild(state.canvas.dom);
    },
    beforeDestroy() {
        window.removeEventListener("keydown", this.listen);
    },
    ready() {
        // Create editor
        editor = CodeMirror.fromTextArea(this.$el.querySelector("#editor"), {
            lineNumbers: true,
            theme: "3024-day",
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
            scrollbarStyle: "null",
            mode: "javascript"
        });

        // Fetch code, either from the browsers local storage or the default
        let value = localStorage.getItem(state.storageKey) || state.editorContent;
        editor.setValue(value);
        alertify.log("Hit Ctrl-S to compile, Ctrl-R to reset");

        // Add a couple of globals which can be used by the editor
        window.SocketIO = SocketIO;
        window.Rest = Rest;
        window.Object3 = Object3;
        window.canvas = state.canvas;
        window.view = state.view;
        window.log = this;
        window.url = state.url;
        window.alertify = alertify;

        // Ping 3rd party controls
        this.refresh();
    },
    methods: {
        refresh() {
            setTimeout( _ => {
                state.canvas.renderer.resize();
                state.canvas.renderer.invalidateViews(60);
                editor.refresh()
            }, 20);
        },
        start() {
            this.treeData = [];
        },
        stop(message) {
            message && alertify.log(message);
        },
        printResults(context) {
            if (Array.isArray(context))
                context.forEach(item => this.treeData.push(item.result));
            else {
                console.log(context)
                this.treeData.push(context)
            }
        },
        listen(e) {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {

                // Save: Ctrl-S
                e.preventDefault();
                try {

                    // Get code from editor and compile using eval
                    let value = editor.getValue();
                    eval(value);

                    // It compiled! Store the code in the browsers local storage and notify
                    alertify.success("Compiled sucessfully");
                    localStorage.setItem(state.storageKey, value);

                } catch (reason) {
                    alertify.error(reason);
                }

            } else if (e.keyCode == 82 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {

                // Reset: Ctrl-R
                e.preventDefault();
                localStorage.removeItem('awv3-analyzer-editor-content');
                editor.setValue(state.editorContent);
                alertify.log("Content has been reset");
            }
        }
    }
}

</script>
