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
    <div>
        <template v-for="(property, key) in schema.properties">
            <slot :name="key" :item="{ key: key, schema: property, value: items[key], update: updateValue }">
                <schema :key="key" :bridge="bridge" :identifier="identifier" :schema="property" :value="items[key]" v-on:input="updateValue($event, key)" />
            </slot>
        </template>
    </div>
</template>

<script>
    import Schema from "@/components/elements/schema.vue";
    import { scaffold, prune } from "../services/schema";

    export default {
        name: "schema-form",

        components: {
            "schema": Schema,
        },

        props: {
            schema: Object,
            value: Object,
            bridge: String,
            identifier: String,
        },

        data() {
            return {
                items: this.value || scaffold(this.schema),
            };
        },

        watch: {
            schema() {
                this.items = scaffold(this.schema);
            },
        },

        methods: {
            updateValue(value, child) {
                this.items[child] = value;
                this.$emit("input", prune(this.items) || {});
            },
        },
    };
</script>
