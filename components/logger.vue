<template>

    <div id="logger">
        <p v-for="item in messages" class="{{item.user.color}}">
            <span class="classcad _{{item.classcad.key}} {{item.classcad.color}}" v-on:mouseover="fade(item, 'classcad', 'add')" v-on:mouseout="fade(item, 'classcad', 'remove')">{{item.classcad.key}}</span>
            <span class="user _{{item.user.key}}" v-on:mouseover="fade(item, 'user', 'add')" v-on:mouseout="fade(item, 'user', 'remove')">{{item.user.key}}</span>
            <span>{{item.sign}}</span>
            <span class="{{item.classes}}">{{item.message}}</span>
            <span> +{{item.diff}}ms</span>
        </p>
    </div>

</template>

<script>

    import { state } from './store';

    export default {
        data: () => ({
            messages: state.messages
        }),
        methods: {
            fade(item, which, action) {
                for(let selector of document.body.querySelectorAll(`.${which}:not(._${item[which].key})`))
                    selector.parentNode.classList[action]('fadeout');
            }
        }
    }
</script>

<style scoped>
    .error { color: white; background-color: #ff4081; font-size: 2em; }
    #logger p, span { margin:0; padding: 0; }
    #logger p.fadeout { opacity: 0.1; }
    #logger span.classcad { cursor: pointer; }
    #logger span.classcad:hover { background-color: #474747; }
    #logger span.user { cursor: pointer; }
    #logger span.user:hover { background-color: #474747; }

    #logger {
        background-color: #3e3e3e;
        font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    }

    #log { flex-grow: 1; overflow-y: scroll; }
    input[type=range] { -webkit-appearance: none; background-color: silver; width: 200px; height:10px; }
    input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; background-color: #555; opacity: 0.5; width: 10px; height: 26px; }
</style>
