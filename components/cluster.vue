<template>

    <div class="container">

        <div class="sessions">
            <div class="cluster">
                <div class="row" v-for="row in sessions">
                    <div v-bind:class="{ item: true, ['bg' + item.color]: true, active: item.tasks.length }" v-for="item in row">
                        <p>CAD{{item.id}}</p>
                        <p>{{item.tasks.length}}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="users">
            <div class="cluster">
                <div class="row" v-for="row in users">
                    <div class="item bg{{item.color}}" v-for="item in row">
                        USR{{item.id}}
                    </div>
                </div>
            </div>
        </div>

        <div class="tasks">
            <div class="cluster">
                <div class="item bg{{item.color}}" v-for="item in state.internal.tasks">
                    <span>{{item.payload}}</span>
                </div>
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
            users: () => createCluster('users'),
            isActive() {
                console.log(this, $item, $index)
            }
        }
    }
</script>

<style scoped>
    .container { position: relative; width: 100%; height: 100%; background-color: white; }
    .sessions { position: absolute; width: 50%; height: 50%; top: 0; left: 0; }
    .users { position: absolute; width: 50%; height: 50%; top: 0; left: 50%; }
    .tasks { position: absolute; width: 100%; height: 50%; top: 50%; left: 0; background-color: #e0e0e0; }
    .row { display: flex; flex: 1 0 2px; overflow: hidden; }
    .cluster { display: flex; flex-direction: column; height: 100%; padding: 0; }
    .item { flex: 1 0 2px; margin: 0px; overflow: hidden; text-overflow: ellipsis; font-family: 'Source Code Pro', monospace; font-size: 12px; padding: 5px; transition: background-color .5s; }
    .item > p { margin: 0; padding: 0; }
    .active { background-color: black; color: white; }
</style>
