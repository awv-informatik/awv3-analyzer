<style lang="sass" scoped>

@import './../theme'

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

.item:hover
    -webkit-filter: invert(0.2)

span
    color: white
    text-overflow: ellipsis
    word-break: break-word

.item p
    margin: 0
    padding: 0

</style>

<template>

<div class="container">

    <div class="row" v-for="row in rows">
        <div v-for="item in row"
            v-bind:class="{ item: true, swoosh: true, ['bg-color-' + item.color + '-400']: true, active: item.tasks.length }"
            v-on:click="state.filter = item.id">
            <template v-if="!simple">
                <p><span>{{item.id}}</span></p>
                <p><span>{{item.tasks.length}}</span></p>
            </template>
        </div>
    </div>

</div>

</template>

<script>

import { state } from './../store';

export default {
    data: () => ({ state: state }),
    props: ['target', 'simple'],
    computed: {
        rows: function () {
            let root = Math.round(Math.sqrt(state.internal[this.target].length));
            let result = [];
            let index = 0;
            while (index < state.internal[this.target].length) {
                let row = [];
                result.push(row);
                for (let r = 0; r < root; r++) {
                    let item = state.internal[this.target][index++];
                    if (item) {
                        row.push(item)
                    } else {
                        break;
                    }
                }
            }
            return result;
        }
    }
}

</script>
