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
    <div id="field">
        <span class="title">{{ name }}</span>
        <span v-if="description && description !== ''" class="description">{{ description }}</span>
        <input
            type="password"
            ref="field"
            autocomplete="false"
            :value="value"
            v-on:input="update()"
            v-on:change="change"
            v-bind:required="required"
        />
    </div>
</template>

<script>
    export default {
        name: "password-field",
        props: {
            name: String,
            description: String,
            value: String,
            required: {
                type: Boolean,
                default: false,
            },
        },

        methods: {
            update() {
                this.$emit("input", this.$refs.field.value);
            },

            change() {
                this.$emit("change", this.$refs.field.value);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #field {
        display: flex;
        flex-direction: column;
        padding: 0 0 20px 0;

        .title {
            font-size: 14px;
            margin: 0 0 7px 0;
            user-select: none;
        }

        .description {
            font-size: 12px;
            margin: -7px 0 7px 0;
            user-select: none;
        }

        input {
            flex: 1;
            padding: 7px;
            font-size: 14px;

            &:focus {
                outline: 0 none;
            }
        }
    }
</style>
