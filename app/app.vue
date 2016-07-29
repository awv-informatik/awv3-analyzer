<style lang="sass">

@import 'theme'
@import 'sass-material-colors/sass/sass-material-colors-classes'

html, body, input
    margin: 0
    padding: 0

body
    background-color: white
    overflow: hidden
    font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif
    font-size: 15px
    -webkit-font-smoothing: antialiased

a
    text-decoration: none
    color: #34495e

#nav
    list-style-type: none
    margin: 0
    padding: 0
    right: 60px
    top: 25px
    height: 40px
    line-height: 40px
    float: right

#nav .break
    display: none

#nav li
    display: inline-block
    position: relative
    margin: 0 0.6em

.nav-link
    padding-bottom: 3px

.nav-link:hover, .nav-link.v-link-active
    border-bottom: 3px solid $accent-color

main
    display: flex
    flex-direction: column
    width: 100%
    height: 100%
    position: absolute

header
    background-color: $background-color
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
    padding: 25px 60px
    position: relative
    z-index: 2

#search-query
    height: 30px
    line-height: 30px
    box-sizing: border-box
    padding: 0 15px 0 30px
    border: 1px solid #e3e3e3
    outline: none
    border-radius: 15px
    margin-right: 10px
    transition: border-color 0.2s ease
    background: #fff url("./search.png") 8px 5px no-repeat
    background-size: 20px

#search-query:focus
    border-color: $accent-color

.logo
    position: absolute!important
    width: 40px!important
    height: 40px!important
    line-height: 40px

.descr
    margin-left: 50px
    float: left
    line-height: 40px
    font-family: 'Montserrat', sans-serif
    font-size: 30px
    color: #34495e

</style>

<template>

<main>
    <header>
        <cluster class="logo" target="sessions" simple="true"></cluster>
        <span class="descr">AWV3<span class="color-teal-a400">ANALYZER</span></span>
        <ul id="nav">
            <li><input type="text" id="search-query" v-model="state.filter"></li>
            <li><a v-link="{ path: '/home' }" class="nav-link">Home</a></li>
            <li><a v-link="{ path: '/log' }" class="nav-link">Log</a></li>
            <li><a v-link="{ path: '/editor' }" class="nav-link">Editor</a></li>
        </ul>
    </header>
    <router-view keep-alive></router-view>
</main>

</template>

<script>

import { state } from './store';
import Analyzer from './analyzer';
import Cluster from './home/cluster.vue';
import alertify from 'alertify.js';

export default {
    components: { cluster: Cluster },
    data: () => ({ state: state }),
    ready() {
        let analyzer = new Analyzer();
        analyzer.connect(state.url)
            .then( _ => alertify.success(`Connected to ${state.url}`))
            .catch( reason => {
                alertify.error(`Could not connect to ${state.url}, reason: ${reason}`);
                alertify.defaultValue(state.url).prompt("Enter server endpoint", val => {
                    state.url = val;
                    analyzer.connect(state.url)
                        .then( _ => alertify.success(`Connected to ${state.url}`))
                        .catch( reason => alertify.error(`Could not connect to ${state.url}, reason: ${reason}`));
                });
            });
    }
}

</script>
