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

header > .logo
    float: left
    line-height: 40px
    font-family: 'Montserrat', sans-serif
    font-size: 30px
    color: #34495e
    background-image: url(./logo.png)
    background-size: cover
    width: 40px

header > .logo > span:first-child
    margin-left: 50px

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

</style>

<template>

<main>
    <header>
        <div class="logo"><span>AWV3</span><span class="color-teal-a400">ANALYZER</span></div>
        <ul id="nav">
            <li>
                <form id="search-form">
                    <input type="text" id="search-query" v-model="state.filter">
                </form>
            </li>
            <li><a v-link="{ path: '/combined' }" class="nav-link">Combined</a></li>
            <li><a v-link="{ path: '/logger' }" class="nav-link">Logger</a></li>
            <li><a v-link="{ path: '/editor' }" class="nav-link">Editor</a></li>
        </ul>
    </header>
    <router-view keep-alive></router-view>
</main>

</template>

<script>

import Analyzer from './analyzer';
import { state } from './store';
import alertify from 'alertify.js'

export default {
    data: () => ({ state: state }),
    ready() {
        new Analyzer().connect(state.url)
            .then( _ => alertify.success(`Connected to ${state.url}`))
            .catch( reason => alertify.error(`Could not connect to ${state.url}, reason: ${reason}`));
    }
}

</script>
