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
            <icon v-if="locked" v-on:click.stop="toggle()" :title="$t('sort_dashboard')" name="lock" class="icon desktop" />
            <icon v-else v-on:click.stop="toggle()" :title="$t('sort_dashboard')" name="lock-open-variant" class="icon desktop" />
            <icon v-on:click.stop="$dialog.open('dashboard')" :title="$t('dashboard_settings')" name="cog" class="icon desktop" />
        </context>
        <div v-if="!$mobile" class="content desktop">
            <grid-layout
                :layout="items"
                :col-num="80"
                :row-height="5"
                :is-draggable="!locked"
                :is-resizable="!locked"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
            >
                <grid-item class="widget" v-for="(item, index) in items" :key="`widget:${index}`" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                    <component :is="item.component" :item="item" :index="index" :locked="locked" />
                </grid-item>
            </grid-layout>
        </div>
        <div v-else class="content mobile">
            <div class="widget">
                <weather-widget />
            </div>
            <div class="widget">
                <bridges-widget />
            </div>
            <div class="widget">
                <system-widget />
            </div>
        </div>
    </div>
</template>

<script>
    import GridLayout from "vue-grid-layout";
    import { initial, widgets } from "../services/widgets";

    export default {
        name: "dashboard",

        components: {
            "grid-layout": GridLayout.GridLayout,
            "grid-item": GridLayout.GridItem,

            ...widgets(),
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
            this.$action.on("settings", "update", async () => {
                await this.load();
                this.render();
            });

            this.$action.on("dashboard", "update", async () => {
                await this.load();
                this.render();
            });
        },

        async mounted() {
            await this.load();
        },

        async beforeRouteLeave(_to, _from, next) {
            if (!this.locked) await this.save();

            next();
        },

        methods: {
            async load() {
                this.loading = true;

                const config = await this.$hoobs.config.get();

                const dashboard = config.dashboard || {
                    items: [...initial],
                };

                this.items = dashboard.items;
                this.backdrop = dashboard.backdrop || false;
                this.loading = false;
            },

            render() {
                this.version += 1;
            },

            async toggle() {
                if (!this.locked) await this.save();

                this.locked = !this.locked;
            },

            async save() {
                if (!this.loading) {
                    const config = await this.$hoobs.config.get();
                    const items = JSON.parse(JSON.stringify(this.items));

                    config.dashboard = config.dashboard || {};

                    for (let i = 0; i < items.length; i += 1) {
                        delete items[i].moved;
                    }

                    config.dashboard.items = items;

                    await this.$hoobs.config.update(config);

                    this.$action.emit("window", "resize");
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
