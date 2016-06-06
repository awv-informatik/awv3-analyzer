<template>

    <div class="container">

        <div class="sessions">
            <div class="cluster">
                <div class="row" v-for="row in sessions">
                    <div v-bind:class="{ item: true, active: item.tasks.length }" v-for="item in row">
                        <div class="stdout">
                            <p v-for="log in item.log">{{log.message}}</p>
                        </div>
                        <div class="tag bg{{item.color}}">
                            <p>{{item.id}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="users">
            <div class="cluster">
                <div class="item row bg{{item.color}}" v-for="item in state.internal.users">
                    <p>USR{{item.id}}</p>
            </div>
        </div>

    </div>

</template>

<script>

    import { createCluster, state } from './store';

    export default {
        data: () => ({
            state: state
        }),
        computed: {
            sessions: () => createCluster('sessions'),
            users: () => createCluster('users')
        }
    }
</script>

<style scoped>
    .container { position: relative; width: 100%; height: 100%; background-color: white; }
    .sessions { position: absolute; width: 70%; height: 100%; top: 0; left: 0; }
    .users { position: absolute; width: 30%; height: 100%; top: 0; left: 70%; }
    .row { display: flex; flex: 1 0 2px; overflow: hidden; }
    .cluster { display: flex; flex-direction: column; height: 100%; padding: 0; }
    .item { position: relative; flex: 1 0 2px; margin: 0px; overflow: hidden; text-overflow: ellipsis; font-family: 'Source Code Pro', monospace; font-size: 12px; transition: background-color .5s; }
    span { text-overflow: ellipsis; }
    .item p { margin: 0; padding: 0; }
    .active { background-color: black; color: white; }
    .stdout { height: 100%; overflow-y: auto; overflow-x: hidden; font-size: 12px; }
    .tag { position: absolute; bottom: 10px; left: 10px; padding: 5px; color: black; }
</style>
