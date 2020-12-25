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
    <modal :title="title" :draggable="true" width="670px" height="470px">
        <div id="instances">
            <div class="content">
                <div class="form">
                    <div class="row">
                        <p>
                            {{ description }}
                        </p>
                    </div>
                    <div class="grid">
                        <div v-for="(instance, index) in instances" :key="`instance:${index}`" v-on:click="select(instance.id)" class="button primary full">{{ instance.display }}</div>
                    </div>
                </div>
            </div>
            <div class="actions modal">
                <div v-on:click="close()" class="button">{{ $t("cancel") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    export default {
        name: "instances",

        props: {
            title: String,
            values: Array,
            description: String,
            select: {
                type: Function,
                default: () => { /* null */ },
            },
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                instances: [],
            };
        },

        mounted() {
            this.instances = this.values;

            this.instances.sort((a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;

                return 0;
            });
        },
    };
</script>

<style lang="scss" scoped>
    #instances {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .full {
            flex: 1;
            margin: 0 10px 10px 0;
            justify-content: space-around;
        }
    }
</style>
