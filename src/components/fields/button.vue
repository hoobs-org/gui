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
        <span v-if="schema.description && schema.description !== ''" class="description">{{ schema.description }}</span>
        <div class="action">
            <div class="button primary" v-on:click="action">{{ schema.title || "Undefined" }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "button-field",

        props: {
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
            identifier: String,
        },

        data() {
            return {
                action: (this.schema.action !== undefined) ? eval(this.schema.action.indexOf("this.") !== 0 ? `this.${this.schema.action}` : this.schema.action) : () => { /* null */ }, // eslint-disable-line no-eval
            };
        },

        methods: {
            dialog() {
                console.log(`dialog: /ui/plugin/${this.identifier}`);
            },

            popup() {
                console.log(`popup: /ui/plugin/${this.identifier}`);
            },
        },
    };
</script>

<style scoped>
    #field {
        display: flex;
        flex-direction: column;
        padding: 0 10px 10px 0;
    }

    #field .description {
        font-size: 12px;
        margin: -7px 0 7px 0;
        user-select: none;
    }

    #field .description:empty {
        display: none;
    }

    #field .action {
        padding: 0;
    }
</style>
