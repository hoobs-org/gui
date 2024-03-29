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
        <div class="position">
            <legend v-if="title && title !== ''" :class="schema.description && schema.description !== '' ? 'legend collapsed' : 'legend'" v-html="title"></legend>
        </div>
        <div v-if="schema.description && schema.description !== ''" class="description" v-html="schema.description"></div>
        <div v-for="(item, index) in items" class="item" :key="index">
            <div class="field">
                <schema
                    :bridge="bridge"
                    :identifier="identifier"
                    :title="schema.title"
                    :description="schema.description"
                    :placeholder="schema.placeholder || schema.example"
                    :field="index"
                    :schema="schema.items"
                    :value="item"
                    :items="items"
                    v-on:input="updateValue($event, index)"
                    v-on:save="$emit('save', $event)"
                />
            </div>
            <div class="action">
                <icon name="delete" v-if="items.length > 0" v-on:click="removeItem(index)" :key="`remove-${index}`" class="icon" />
            </div>
        </div>
        <icon name="plus-circle" v-if="!schema.maxItems || items.length < schema.maxItems" v-on:click="addItem()" class="icon add" />
    </div>
</template>

<script>
    import { scaffold, decamel } from "../../services/schema";

    export default {
        name: "list-field",

        components: {
            "schema": () => import(/* webpackChunkName: "config" */ "@/components/elements/schema.vue"),
        },

        props: {
            field: [String, Number],
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
            bridge: String,
            identifier: String,
        },

        data() {
            return {
                label: "",
                items: (this.value !== undefined) ? this.value : [],
            };
        },

        mounted() {
            this.label = this.title || decamel(this.field);
        },

        methods: {
            addItem() {
                this.items.push(scaffold(this.schema)[0]);
            },

            removeItem(index) {
                this.items.splice(index, 1);

                this.$emit("input", this.items);
                this.$emit("change", this.items);
            },

            updateValue(value, index) {
                this.items.splice(index, 1, value);

                this.$emit("input", this.items);
                this.$emit("change", this.items);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #field {
        flex: 1;
        padding: 0 10px 0 0;

        .position {
            margin: 0 0 7px 0;
            user-select: none;
            cursor: default;
        }

        .legend {
            color: var(--application-highlight);
            padding: 0 0 7px 0;
            font-size: 14px;
            border-bottom: 1px var(--application-border) solid;
            overflow: hidden;

            &.collapsed {
                margin: 0;
            }
        }

        .description {
            font-size: 12px;
            margin: 0;
            user-select: none;

            &:empty {
                display: none;
            }
        }

        .add {
            cursor: pointer;
            margin: 10px 0 0 0;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }

        .item {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            position: relative;
            padding: 20px 10px 10px 30px;
            margin: 10px 0 0 0;

            &::after {
                content: '';
                width: 100%;
                height: 100%;
                background: var(--application-input-text);
                opacity: 0.017;
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
            }

            .field {
                flex: 1;
                opacity: 1;
            }

            .action {
                height: 32px;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin: 0 0 20px 0;
                cursor: pointer;
                opacity: 0.7;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>
