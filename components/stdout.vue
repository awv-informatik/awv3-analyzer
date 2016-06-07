<style lang="sass" scoped>

@import 'theme'

.container
    position: relative
    width: 100%
    height: 100%
    display: flex
    flex-direction: column

.row
    display: flex
    flex: 1 0 2px
    overflow: hidden

.item
    position: relative
    flex: 1 0 2px
    margin: 0px
    overflow: hidden
    text-overflow: ellipsis
    font-family: 'Source Code Pro', monospace
    font-size: 12px
    overflow: hidden
    cursor: pointer

.item:after
    content: ""
    background: rgba(0, 0, 0, 0.5)
    width: 100%
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    transform: translateY(100%)
    transform-origin: 50% 100%

.active:after
    animation-name: example
    animation-duration: 2s
    animation-iteration-count: infinite
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1)

@keyframes example
    0%   {transform: translateY(100%);}
    30% {transform: translateY(-100%);}
    75% {transform: translateY(100%);}

span
    color: white
    text-overflow: ellipsis
    word-break: break-word

.item p
    margin: 0
    padding: 0

.stdout
    height: 100%
    overflow-y: auto
    overflow-x: hidden
    font-size: 12px

.preview
    width: 100%
    height: 100%

</style>

<template>

<div class="container">

    <div class="row" v-for="row in rows">
        <div v-bind:class="{ item: true, 'get-button': true, ['bg-color-' + item.color + '-600']: true, active: item.tasks.length }" v-for="item in row">
            <div class="stdout">
                <p v-for="log in item.log">{{log.message}}</p>
            </div>
        </div>
    </div>

</div>

</template>

<script>

import { createCluster, state } from './store';

export default {
    data: () => ({ state: state }),
    computed: {
        rows: function () {
            return createCluster("sessions")
        }
    }
}

</script>
