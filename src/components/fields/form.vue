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
        <legend v-if="title && title !== ''" class="legend">{{ title }}</legend>
        <div v-if="schema.description && schema.description !== ''" class="description">{{ schema.description }}</div>
        <schema v-for="(child, key) in schema.properties" :bridge="bridge" :identifier="identifier" :schema="child" :value="internalValue[key]" :key="key" v-on:input="updateValue($event, key)" />
    </fieldset>
</template>

<script>

    export default {
        name: "form-field",

        components: {
            "schema": () => import("@/components/elements/schema.vue"),
        },

        props: {
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
            bridge: String,
            identifier: String,
        },

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
        padding: 0 10px 10px 20px;
        border: none;
        border-left: 4px var(--application-border) solid;

        .legend {
            color: var(--application-highlight);
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .description {
            font-size: 12px;
            margin: 0 0 20px 0;
            user-select: none;

            &:empty {
                display: none;
            }
        }
    }
</style>
