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
        <span v-if="schema.description && schema.description !== ''" class="description" v-html="schema.description"></span>
        <div v-if="schema.title && schema.populated_title" class="action">
            <div v-if="value" class="button" v-on:click="clear">{{ schema.populated_title }}</div>
            <div v-else class="button primary" v-on:click="open">{{ schema.title }}</div>
        </div>
        <div v-else class="action">
            <div class="button primary" v-on:click="open">{{ schema.title || "Undefined" }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "button-field",

        props: {
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            items: [Object, Array],
            title: String,
            bridge: String,
            identifier: String,
        },

        methods: {
            update(value) {
                this.$emit("input", value);
                this.$emit("change", value);
            },

            clear() {
                this.$emit("input", undefined);
                this.$emit("change", undefined);
            },

            open() {
                let dialog = "dialog";

                switch (this.schema.action) {
                    case "popup":
                        dialog = "popup";
                        break;

                    default:
                        dialog = "dialog";
                        break;
                }

                this.$dialog.open(dialog, {
                    url: `${this.$hoobs.config.host.get("ui")}/plugin/${encodeURIComponent(this.identifier)}/`,
                    value: this.value,
                    items: this.items,
                    update: this.update,
                    bridge: this.bridge,
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    #field {
        display: flex;
        flex-direction: column;
        padding: 0 10px 10px 0;

        .description {
            font-size: 12px;
            margin: -7px 0 7px 0;
            user-select: none;

            &:empty {
                display: none;
            }
        }

        .action {
            padding: 0;
        }
    }
</style>
