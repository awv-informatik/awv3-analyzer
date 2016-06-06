<template>

    <div id="view"></div>

</template>

<script>
    import { state } from './store';

    export default {
        data() {
            return { }
        },
        compiled() {
            this.$el.appendChild(state.canvas.dom);
        },
        ready() {
            state.canvas.renderer.resize();
            state.canvas.renderer.invalidateViews(60);
        }
    }
</script>

<style scoped>
    #view { position: relative; width: 100%; height: 100%; overflow: hidden; background-color: #dedede; }
</style>
