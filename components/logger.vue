<style lang="sass" scoped>

@import 'theme'

#logger
    font-family: 'Source Code Pro', monospace
    font-size: 12px
    width: 100%
    height: 100%
    overflow-y: auto
    overflow-x: hidden
    margin: 0
    padding: 0
    background-color: $background-color-logger

#logger-wrap
    margin: 60px

#logger p, span
    margin: 0px
    padding: 0

#logger p.fadeout
    opacity: 0.1

#logger span.classcad, #logger span.user
    cursor: pointer

#logger span.classcad:hover, #logger span.user:hover
    background-color: #474747

#log
    flex-grow: 1
    overflow-y: scroll

.dot
    border-radius: 50%
    display: inline-block
    width: 10px
    height: 10px
    margin: 0
    margin-right: 5px

</style>

<template>

<div id="logger">
    <div id="logger-wrap">
        <p v-for="item in messages" class="color-{{item.user.color}}-600">
            <span class="dot bg-color-{{item.user.color}}-600"></span>
            <span class="classcad _{{item.classcad.key}} color-{{item.classcad.color}}-600" v-on:mouseover="fade(item, 'classcad', 'add')" v-on:mouseout="fade(item, 'classcad', 'remove')">{{item.classcad.key}}</span>
            <span class="user _{{item.user.key}}" v-on:mouseover="fade(item, 'user', 'add')" v-on:mouseout="fade(item, 'user', 'remove')">{{item.user.key}}</span>
            <span>{{item.sign}}</span>
            <span class="{{item.classes}}color-{{item.user.color}}-600">{{item.message}}</span>
            <span> +{{item.diff}}ms</span>
        </p>
    </div>
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
            for (let selector of document.body.querySelectorAll(`.${which}:not(._${item[which].key})`))
                selector.parentNode.classList[action]('fadeout');
        }
    }
}

</script>
