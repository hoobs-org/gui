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
    <fieldset id="field">
        <legend v-if="schema.title">{{ schema.title }}</legend>
        <div class="content" v-if="schema.description">
            {{ schema.description }}
        </div>
        <schema v-for="(child, key) in schema.properties" :schema="child" :value="internalValue[key]" :key="key" @input="updateValue($event, key)" />
    </fieldset>
</template>

<script>

    export default {
        name: "form-field",

        components: {
            "schema": () => import("@/components/elements/schema.vue"),
        },

        props: [
            "schema",
            "value",
        ],

        data() {
            return {
                internalValue: (this.value !== undefined) ? this.value : {},
            };
        },

        watch: {
            value(value) {
                this.internalValue = value;
            },
        },

        methods: {
            updateValue(value, child) {
                this.internalValue[child] = value;
                this.$emit("input", this.internalValue);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #field {
        flex: 1;
        padding: 10px;
        border: none;
        border-left: 4px #dfdfdf solid;

        legend {
            color: #feb400;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
        }
    }
</style>
