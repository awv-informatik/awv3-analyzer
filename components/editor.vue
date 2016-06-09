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

.toggle
    cursor: pointer

.bold
    font-weight: bold

ul
    padding-left: 1em
    list-style-type: none

ul p
    margin: 0

ul span.stretch
    margin-left: 0.3em
    margin-right: 0.3em

.array
    margin-left: 0.2em
    margin-right: 0.2em

</style>

<template>

<div class="editor-container">

    <div id="editor-side">
        <div class="editor-view swoosh {{active ? 'active' : ''}}"></div>
        <div class="editor-results cm-s-3024-day">
            <ul>
                <item class="child" :model="treeData" :open="true"></item>
            </ul>
        </div>
    </div>
    <div id="editor-code">
        <textarea id="editor"></textarea>
    </div>
</div>

</template>

<script>

import Vue from 'vue';
import { state } from './store';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import alertify from 'alertify.js'
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/selection/active-line.js';

let editor = undefined;

// define the item component
Vue.component('item', {
    template: `

    <template v-if="isAtomic">
        <p><span class="cm-property" v-if="!!key">{{ key }}: </span><span :class="{'cm-number': isNumber, 'cm-string': !isNumber}">{{ model }}</span></p>
    </template>

    <li v-else>

    <template v-if="isObject">
        <span class="cm-property" v-if="!!key">{{ key }}: </span>
        {
            <span class="toggle cm-variable-2" @click="toggle">[{{opened ? '-' : '+'}}]</span>
            <ul v-show="opened">
                <item v-for="item in model" :model="item" :key="$key"></item>
            </ul>
        }
    </template>

    <template v-if="isArray">
        <span class="cm-property" v-if="!!key">{{ key }}: </span>
        [
            <span class="stretch cm-number" v-if="isFlatArray" v-for="item in model" :model="item">{{ item }}</span>
            <template v-if="!isFlatArray">
                <span class="toggle cm-variable-2" @click="toggle">[{{opened ? '-' : '+'}}]</span>
                <ul v-show="opened">
                    <item v-for="item in model" :model="item"></item>
                </ul>
            </template>
        ]
    </template>

    </li>

    `,
    props: [ 'model', 'key', 'open' ],
    data() {
        return { opened: this.open }
    },
    computed: {
        isAtomic() {
            return typeof this.model !== 'object' && !Array.isArray(this.model);
        },
        isObject() {
            return typeof this.model === 'object' && !Array.isArray(this.model);
        },
        isArray() {
            return Array.isArray(this.model);
        },
        isFlatArray() {
            if (Array.isArray(this.model)) {
                for (let item of this.model) {
                    if (typeof item === 'object')
                        return false;
                }
                return true;
            }
        },
        isNumber() {
            return !isNaN(parseFloat(this.model));
        }
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    }
});

export default {
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
            styleActiveLine: true,
            scrollbarStyle: "null",
            mode: "javascript"
        });

        // Fetch code, either from the browsers local storage or the default
        let value = localStorage.getItem('awv3-analyzer-editor-content') || state.code;
        editor.setValue(value);
        alertify.log("Hit Ctrl-S to compile, Ctrl-R to reset");

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
                editor.refresh()
            }, 20);
        },
        start() {
            this.active = true;
            this.treeData = [];
        },
        stop() {
            this.active = false;
        },
        printResults(context) {
            if (Array.isArray(context))
                context.forEach(item => this.treeData.push(item.result));
            else
                this.treeData.push(context)
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
                    localStorage.setItem('awv3-analyzer-editor-content', value);

                } catch (reason) {
                    alertify.error(reason);
                }

            } else if (e.keyCode == 82 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {

                // Reset: Ctrl-R
                e.preventDefault();
                localStorage.removeItem('awv3-analyzer-editor-content');
                editor.setValue(state.code);
                alertify.log("Content has been reset");
            }
        }
    }
}

</script>
