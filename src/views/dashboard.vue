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
    <div :key="version" id="dashboard" :class="backdrop ? 'backdrop' : ''">
        <context>
            <div v-if="locked" v-on:click.stop="toggle('locked')" class="icon desktop">lock</div>
            <div v-else v-on:click.stop="toggle('locked')" class="icon desktop">lock_open</div>
            <div v-on:click.stop="$dialog.open('dashboard')" class="icon desktop">settings</div>
        </context>
        <div class="content desktop">
            <grid-layout
                :layout="items"
                :col-num="12"
                :row-height="30"
                :is-draggable="!locked"
                :is-resizable="!locked"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
                v-on:layout-updated="save"
            >
                <grid-item class="widget" v-for="(item, index) in items" :key="`widget:${index}`" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                    <component :is="item.component" :item="item" :index="index" />
                </grid-item>
            </grid-layout>
        </div>
        <div class="content mobile">
            <div class="widget">
                <weather />
            </div>
            <div class="widget">
                <bridges />
            </div>
            <div class="widget">
                <system />
            </div>
        </div>
    </div>
</template>

<script>
    import GridLayout from "vue-grid-layout";

    export default {
        name: "dashboard",

        components: {
            "grid-layout": GridLayout.GridLayout,
            "grid-item": GridLayout.GridItem,

            "activity": () => import(/* webpackChunkName: "dialog:activity" */ "@/components/widgets/activity.vue"),
            "cpu": () => import(/* webpackChunkName: "dialog:cpu" */ "@/components/widgets/cpu.vue"),
            "memory": () => import(/* webpackChunkName: "dialog:memory" */ "@/components/widgets/memory.vue"),
            "bridges": () => import(/* webpackChunkName: "dialog:bridges" */ "@/components/widgets/bridges.vue"),
            "system": () => import(/* webpackChunkName: "dialog:system" */ "@/components/widgets/system.vue"),
            "log": () => import(/* webpackChunkName: "dialog:log" */ "@/components/widgets/log.vue"),
            "weather": () => import(/* webpackChunkName: "dialog:weather" */ "@/components/widgets/weather.vue"),
            "current": () => import(/* webpackChunkName: "dialog:current" */ "@/components/widgets/current.vue"),
            "forecast": () => import(/* webpackChunkName: "dialog:forecast" */ "@/components/widgets/forecast.vue"),
        },

        data() {
            return {
                version: 0,
                locked: true,
                loading: true,
                backdrop: false,
                items: [],
            };
        },

        created() {
            this.$action.on("settings", "update", () => {
                this.load();
                this.render();
            });

            this.$action.on("dashboard", "update", () => {
                this.load();
                this.render();
            });
        },

        mounted() {
            this.load();
        },

        methods: {
            load() {
                this.loading = true;

                const { dashboard } = this.$store.state;

                this.items = dashboard.items;
                this.backdrop = dashboard.backdrop || false;
                this.loading = false;
            },

            render() {
                this.version += 1;
            },

            toggle(field) {
                this[field] = !this[field];
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
        display: flex;
        overflow: hidden;
        flex-direction: column;

        &.backdrop {
            background-image: var(--backdrop);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
        }

        .content {
            flex: 1;
            overflow: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            background: linear-gradient(
                to bottom,
                var(--application-background) 0%,
                #00000000 30%
            );

            &::-webkit-scrollbar {
                display: none;
            }

            .widget {
                color: var(--widget-text);
                background: var(--widget-background);
                backdrop-filter: var(--transparency);
                border-radius: 0;
                box-sizing: border-box;
                overflow: hidden;
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #dashboard {
            .content {
                .widget {
                    color: var(--application-text);
                    background: var(--application-background);
                }
            }
        }
    }
</style>
