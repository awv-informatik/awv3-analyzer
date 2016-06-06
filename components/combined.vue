<template>
    <div id="combined">
        <div id="left">
            <cluster-component></cluster-component>
            <view-component></view-component>
        </div>
        <logger-component></logger-component>
    </div>

</template>

<script>

    import View from './view.vue';
    import Logger from './logger.vue';
    import Cluster from './cluster.vue';

    export default {
        data: () => ({}),
        components: {
            'view-component': View,
            'logger-component': Logger,
            'cluster-component': Cluster
        }
    }
</script>

<style scoped>

    #combined { display: flex; flex-direction: row; width: 100%; height: 100%; background-color: white; }
    #left { display: flex; flex-direction: column; flex: 1 0 600px; }

</style>
