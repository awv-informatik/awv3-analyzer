<style lang="sass" scoped>

.bold
    font-weight: bold

ul
    padding-left: 1em
    list-style-type: none

ul p
    margin: 0

ul span.stretch
    margin-left: 0.3em
    margin-right: 0.3em

span.array
    margin-left: 0.2em
    margin-right: 0.2em

span.string
    color: #ff9800

span.number
    color: #a16a94

span.property
    color: #01a252

span.toggle
    color: #01a0e4
    cursor: pointer

</style>

<template>

<template v-if="isAtomic">
    <p><span class="property" v-if="!!key">{{ key }}: </span><span :class="{'number': isNumber, 'string': !isNumber}">{{ model }}</span></p>
</template>

<li v-else>

    <template v-if="isObject">
        <span class="property" v-if="!!key">{{ key }}: </span> {
        <span class="toggle" @click="toggle">[{{opened ? '-' : '+'}}]</span>
        <ul v-show="opened">
            <json-tree v-for="item in model" :model="item" :key="$key"></json-tree>
        </ul>
        }
    </template>

    <template v-if="isArray">
        <span class="property" v-if="!!key">{{ key }}: </span> [
        <span class="number array" v-if="isFlatArray" v-for="item in model" :model="item">{{ item }}</span>
        <template v-if="!isFlatArray">
            <span class="toggle" @click="toggle">[{{opened ? '-' : '+'}}]</span>
            <ul v-show="opened">
                <json-tree v-for="item in model" :model="item"></json-tree>
            </ul>
        </template>
        ]
    </template>

</li>

</template>

<script>

export default {
    name: 'json-tree',
    props: [ 'model', 'key', 'open' ],
    data() {
        return { opened: this.open }
    },
    computed: {
        isAtomic() {
            return typeof this.model !== 'object' && !Array.isArray(this.model);
        },
        isObject() {
            return typeof this.model === 'object' && !Array.isArray(this.model);
        },
        isArray() {
            return Array.isArray(this.model);
        },
        isFlatArray() {
            if (Array.isArray(this.model)) {
                for (let item of this.model) {
                    if (typeof item === 'object')
                        return false;
                }
                return true;
            }
        },
        isNumber() {
            return !isNaN(parseFloat(this.model));
        }
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    }
}

</script>
