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
    padding: 10px
    overflow-y: auto
    overflow-x: hidden

.alertify-logs
    z-index: 1000

.child
    cursor: pointer

.bold
    font-weight: bold

li
    list-style-type: none

ul
    padding-left: 1em
    padding-bottom: 0.5em
    line-height: 1.5em
    list-style-type: none

.array
    margin-left: 0.2em
    margin-right: 0.2em

</style>

<template>

<div class="editor-container">

    <div id="editor-side">
        <div class="editor-view swoosh {{active ? 'active' : ''}}"></div>
        <div class="editor-results">
            <ul id="demo">
                <item class="child" :model="treeData"></item>
            </ul>
        </div>
    </div>
    <div id="editor-code">
        <textarea id="editor" name="code"></textarea>
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

// define the item component
Vue.component('item', {
    template: `

    <li v-if="!isObject">
        <div v-if="!isObject">{{key}}: {{model}}</div>
    </li>
    <li v-else>
        <div v-show="!!key" :class="{bold: isObject}" @click="toggle">
            {{key}}<span v-if="!isObject">: {{model}}</span>
            <span v-if="isObject">[{{open ? '-' : '+'}}]</span>
        </div>

        <div v-show="isFlatArray">
            [<span v-for="item in keys" class="array">{{item.model}}</span>]
        </div>
        <ul v-else v-show="open" v-if="isObject">
            <item class="child" v-for="item in keys" :model="item.model" :key="item.key"> </item>
        </ul>
    </li>`,
  props: [ 'model', 'key' ],
  data() {
    return { open: true }
  },
  computed: {
      isObject() {
          return (typeof this.model === 'object');
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
          return !isNaN(parseFloat(this.key));
      },
      keys() {
        let keys = [];
        if (Array.isArray(this.model)) {
            for (let item of this.model)
                keys.push({model: item});
        } else {
            for (let key in this.model) {
                if (this.model.hasOwnProperty(key))
                    keys.push({model: this.model[key], key});
            }
        }
        return keys;
    }
  },
  methods: {
    toggle() {
        this.open = !this.open;
    }
  }
})

export default {
    data: () => ({
        active: false,
        treeData: []
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
            scrollbarStyle: "null",
            mode: "javascript"
        });

        setTimeout( _ => this.editor.refresh(), 20);

        // Fetch code, either from the browsers local storage or the default
        let value = localStorage.getItem('awv3-analyzer-editor-content') || state.code;
        this.editor.setValue(value);
        alertify.log("Hit ctrl-s to compile, ctrl-r to reset");

        window.SocketIO = SocketIO;
        window.Object3 = Object3;
        window.canvas = state.canvas;
        window.view = state.view;
        window.log = this;
        window.startupUrl = state.url;

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
            this.treeData = [];
        },
        stop() {
            this.active = false;
        },
        printResults(context) {
            if (Array.isArray(context)) {
                context.forEach(item => this.treeData.push(item.result));
            } else {
                this.treeData.push(context)
            }
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
                this.editor.setValue(state.code);
                alertify.log("Content has been reset");
            }
        }
    }
}

</script>
