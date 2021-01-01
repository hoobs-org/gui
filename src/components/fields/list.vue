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
        <legend v-if="title && title !== ''" :class="schema.description && schema.description !== '' ? 'legend collapsed' : 'legend'">{{ title }}</legend>
        <div v-if="schema.description && schema.description !== ''" class="description">{{ schema.description }}</div>
        <div v-for="(item, index) in items" class="item" :key="index">
            <div class="field">
                <schema
                    :instance="instance"
                    :identifier="identifier"
                    :title="schema.title"
                    :description="schema.description"
                    :placeholder="schema.example"
                    :schema="schema.items"
                    :value="item"
                    v-on:input="updateValue($event, index)"
                />
            </div>
            <div class="action">
                <div class="icon" v-if="items.length > 0" v-on:click="removeItem(index)" :key="`remove-${index}`">delete</div>
            </div>
        </div>
        <div class="icon add" v-on:click="addItem()">add_circle</div>
    </fieldset>
</template>

<script>
    import { scaffold } from "../../services/schema";

    export default {
        name: "list-field",

        components: {
            "schema": () => import("@/components/elements/schema.vue"),
        },

        props: {
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
            instance: String,
            identifier: String,
        },

        data() {
            return {
                items: (this.value !== undefined) ? this.value : scaffold(this.schema),
            };
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
        padding: 0 10px 10px 10px;
        border: none;
        border-left: 4px var(--application-border) solid;

        .legend {
            color: var(--application-highlight);
            margin: 0 0 20px 0;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            &.collapsed {
                margin: 0;
            }
        }

        .description {
            font-size: 12px;
            margin: 0 0 20px 0;
            user-select: none;

            &:empty {
                display: none;
            }
        }

        .add {
            cursor: pointer;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }

        .item {
            display: flex;
            flex-direction: row;
            align-items: flex-end;

            .field {
                flex: 1;
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
