<style lang="sass" scoped>

#combined
    width: 100%
    height: 100%
    background-color: white
    display: flex

.left-side
    display: flex
    flex-direction: column
    flex: 1 0 calc(30% - 120px)
    min-width: 0
    margin: 60px

.right-side
    flex: 1 0 70%
    min-width: 0

.users
    margin-top: 60px

</style>

<template>

<div id="combined">
    <div class="left-side">
        <cluster target="sessions" class="sessions"></cluster>
        <cluster target="users" class="users"></cluster>
    </div>
    <div class="right-side">
        <logger scroll="true" class="log"></logger>
    </div>
</div>

</template>

<script>

import Logger from './logger.vue';
import Cluster from './cluster.vue';

export default {
    data: () => ({}),
    components: {
        'logger': Logger,
        'cluster': Cluster
    }
}

</script>
