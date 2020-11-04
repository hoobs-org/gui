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
    <div id="dashboard">
        <div class="content">
            <grid-layout
                :layout="items"
                :col-num="12"
                :row-height="30"
                :is-draggable="true"
                :is-resizable="true"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
                v-on:layout-updated="save"
            >
                <grid-item
                    class="widget"
                    v-for="(item, index) in items"
                    :key="index"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                >
                    <component :is="item.component" :item="item" :index="index" :change="update" />
                </grid-item>
            </grid-layout>
        </div>
    </div>
</template>

<script>
    import GridLayout from "vue-grid-layout";
    import Activity from "../components/widgets/activity.vue";
    import Favorites from "../components/widgets/favorites.vue";
    import System from "../components/widgets/system.vue";
    import Weather from "../components/widgets/weather.vue";

    export default {
        name: "dashboard",

        components: {
            "grid-layout": GridLayout.GridLayout,
            "grid-item": GridLayout.GridItem,
            "activity": Activity,
            "favorites": Favorites,
            "system": System,
            "weather": Weather,
        },

        data() {
            return {
                loading: true,
                items: [],
            };
        },

        mounted() {
            const { dashboard } = this.$store.state;

            this.items = dashboard.items;
            this.loading = false;
        },

        methods: {
            update(index, name, value) {
                this.items[index][name] = value;

                this.save();
            },

            save() {
                if (!this.loading) {
                    const items = JSON.parse(JSON.stringify(this.items));

                    for (let i = 0; i < items.length; i += 1) {
                        delete items[i].moved;
                    }

                    this.$store.commit("DASHBOARD:LAYOUT", items);
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #dashboard {
        flex: 1;
        padding: 7px;
        display: flex;
        flex-direction: row;
        overflow: hidden;

        .content {
            flex: 1;
            overflow: hidden;

            &:hover {
                overflow: overflow;
            }

            .widget {
                color: var(--application-text);
                background: var(--application-drawer);
                backdrop-filter: var(--transparency);
                box-shadow: var(--elevation-button);
                border-radius: 0;
                box-sizing: border-box;
                overflow: hidden;

                &:hover {
                    overflow: overflow;
                }
            }
        }
    }
</style>
