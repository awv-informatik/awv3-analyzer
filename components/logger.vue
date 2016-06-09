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
    margin: 0
    padding: 0
    word-break: break-word

#logger p.fadeout
    opacity: 0.1

#logger span.classcad, #logger span.user
    cursor: pointer

#logger span.classcad-error
    background-color: $error-color
    color: white
    font-size: 2em
    font-weight: 600

#logger span.classcad:hover, #logger span.user:hover
    background-color: #d0d0d0

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
        <p v-for="item in messages | filterBy state.filter" track-by="$index"
            class="color-{{item.user.color}}-600 {{!user && !classcad || (item.classcad.key === classcad || item.user.key === user) ? '' : 'fadeout'}}">
            <span class="dot bg-color-{{item.user.color}}-600"></span>
            <span class="classcad _{{item.classcad.key}} color-{{item.classcad.color}}-600"
                v-on:mouseover="fade(item, 'classcad', 'add')"
                v-on:mouseout="fade(item, 'classcad', 'remove')"
                v-on:click="state.filter = item.classcad.key">
                {{item.classcad.key}}
            </span>
            <span class="user _{{item.user.key}}"
                v-on:mouseover="fade(item, 'user', 'add')"
                v-on:mouseout="fade(item, 'user', 'remove')"
                v-on:click="state.filter = item.user.key">
                {{item.user.key}}
            </span>
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
        messages: state.messages,
        classcad: null,
        user: null,
        state
    }),
    watch: {
        messages(val, oldVal) {
            if (this.scroll)
                requestAnimationFrame( _ => this.$el.scrollTop = this.$el.scrollHeight);
        }
    },
    props: ['scroll'],
    methods: {
        fade(item, which, action) {
            this[which] = (action === 'add') ? item[which].key : undefined;
        }
    }
}

</script>
