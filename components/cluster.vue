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
    cursor: pointer

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

.tag
    position: absolute
    bottom: 10px
    left: 10px
    padding: 5px
    color: black

.preview
    width: 100%
    height: 100%

</style>

<template>

<div class="container">

    <div class="row" v-for="row in rows">
        <div v-bind:class="{ item: true, swoosh: true, ['bg-color-' + item.color + '-400']: true, active: item.tasks.length }" v-for="item in row">
            <p><span>{{item.id}}</span></p>
            <p><span>{{item.tasks.length}}</span></p>
            <!--<div class="stdout">
                <p v-for="log in item.log">{{log.message}}</p>
            </div>
            <div class="tag bg-color-{{item.color}}-600">
                <p>{{item.id}}</p>
            </div>-->
        </div>
    </div>

</div>

</template>

<script>

import { createCluster, state } from './store';

export default {
    data: () => ({ state: state }),
    props: ['target'],
    computed: {
        rows: function () {
            return createCluster(this.target)
        }
    }
}

</script>
