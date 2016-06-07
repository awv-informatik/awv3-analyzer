<style lang="sass" scoped>

@import 'theme'

.container
    position: relative
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    color: white

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

span
    color: white
    text-overflow: ellipsis
    word-break: break-word

.item p
    margin: 0
    padding: 0

.stdout
    height: auto
    font-size: 12px
    padding: 60px

.pad
    overflow-y: auto
    overflow-x: hidden

</style>

<template>

<div class="container">

    <div class="row" v-for="row in rows">
        <div v-bind:class="{ item: true, ['bg-color-' + item.color + '-400']: true, pad: true }" v-for="item in row">
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
