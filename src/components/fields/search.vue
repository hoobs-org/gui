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
    <div id="field" class="field">
        <span class="title">{{ name }}</span>
        <span v-if="description && description !== ''" class="description">{{ description }}</span>
        <input
            :id="id || uuid"
            :ref="uuid"
            type="text"
            autocomplete="false"
            autocorrect="off"
            autocapitalize="none"
            data-lpignore="true"
            :value="value"
            v-on:input="update()"
            v-on:change="change"
            v-bind:required="required"
        />
        <span v-on:click="search()" class="icon">search</span>
    </div>
</template>

<script>
    export default {
        name: "search-field",

        props: {
            id: {
                type: String,
                default: undefined,
            },
            name: String,
            description: String,
            value: String,
            required: {
                type: Boolean,
                default: false,
            },
            search: {
                type: Function,
                default: () => { /* null */ },
            },
            autofocus: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                uuid: "",
            };
        },

        methods: {
            update() {
                this.$emit("input", this.$refs[this.uuid].value);
            },

            change() {
                this.$emit("change", this.$refs[this.uuid].value);
            },
        },

        mounted() {
            if (this.id === undefined || typeof String) {
                this.uuid = `search_field_${Math.random().toString(36).substring(2, 10)}`;
            } else {
                this.uuid = this.id;
            }

            if (this.autofocus) {
                setTimeout(() => {
                    if (this.$refs[this.uuid]) this.$refs[this.uuid].focus();
                }, 10);
            }
        },
    };
</script>

<style lang="scss" scoped>
    #field {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 0 10px 20px 0;

        .title {
            font-size: 14px;
            margin: 0 0 7px 0;
            user-select: none;

            &:empty {
                display: none;
            }
        }

        .icon {
            position: absolute;
            bottom: 27px;
            right: 7px;
            color: var(--modal-text);
            font-size: 18px;
            opacity: 0.5;
            user-select: none;
            cursor: pointer;

            &:hover {
                opacity: 1;
            }
        }

        .description {
            font-size: 12px;
            margin: -7px 0 7px 0;
            user-select: none;

            &:empty {
                display: none;
            }
        }

        input {
            flex: 1;
            padding: 7px 30px 7px 7px;
            font-size: 14px;

            &:focus {
                outline: 0 none;
            }
        }
    }
</style>
