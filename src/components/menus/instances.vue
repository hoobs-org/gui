<!-------------------------------------------------------------------------------------------------
 | hoobs-gui                                                                                      |
 | Copyright (C) 2020 HOOBS                                                                       |
 |                                                                                                |
 | This program is free software: you can redistribute it and/or modify                           |
 | it under the terms of the GNU General Public License as published by                           |
 | the Free Software Foundation, either version 3 of the License, or                              |
 | (at your option) any later version.                                                            |
 |                                                                                                |
 | This program is distributed in the hope that it will be useful,                                |
 | but WITHOUT ANY WARRANTY; without even the implied warranty of                                 |
 | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  |
 | GNU General Public License for more details.                                                   |
 |                                                                                                |
 | You should have received a copy of the GNU General Public License                              |
 | along with this program.  If not, see <http://www.gnu.org/licenses/>.                          |
 -------------------------------------------------------------------------------------------------->

<template>
    <div v-on:click.stop id="menu">
        <div v-for="(instance, index) in selected" :key="index" class="item">
            <checkbox :id="`instance_${index}`" v-model="instance.selected">
                <label :for="`instance_${index}`">{{ instance.text }}</label>
            </checkbox>
        </div>
        <div v-on:click="close()" class="icon close mobile">close</div>
    </div>
</template>

<script>
    export default {
        name: "instances-menu",

        props: {
            value: Array,
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                selected: [],
            };
        },

        mounted() {
            this.selected = this.value;
        },

        watch: {
            selected() {
                this.$emit("input", this.selected);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #menu {
        min-width: 120px;
        position: absolute;
        top: 34px;
        left: 10px;
        display: flex;
        padding: 0 0 7px 0;
        flex-direction: column;
        color: var(--menu-text);
        background: var(--menu-background);
        backdrop-filter: var(--transparency);
        box-shadow: var(--elevation);
        border-radius: 0;
        z-index: 3000;

        .close {
            position: absolute;
            top: 14px;
            right: 14px;
            font-size: 17px;
            color: var(--application-text);
            cursor: pointer;
        }

        .item {
            padding: 7px 20px 0 20px;
            display: block;
            color: var(--menu-text) !important;
            text-decoration: none !important;
            user-select: none;
            cursor: pointer;

            &.disabled {
                opacity: 0.4;
                cursor: default;

                &:hover {
                    background: unset;
                    color: var(--menu-text) !important;
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #menu {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            min-width: unset;
            background: var(--application-background);
            color: var(--modal-text);
            padding: 20px 0;
            top: 0;
            right: unset;
            left: 0;

            .item {
                color: var(--modal-text) !important;

                &:first-child {
                    border-top: 0 none;
                }
            }
        }
    }
</style>
