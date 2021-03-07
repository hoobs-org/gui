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
    <div id="control">
        <div class="item">
            <div class="background">
                <div class="panel">
                    <div class="main"></div>
                </div>
            </div>
            <div v-if="!disabled" v-on:click="remove" class="remove">
                <icon name="delete" class="icon" :title="$t('remove_from_dashboard')" />
            </div>
        </div>
        <div class="name">{{ $t("unavaliable") }}</div>
    </div>
</template>

<script>
    import { Wait } from "@hoobs/sdk/lib/wait";

    export default {
        name: "unavailable-accessory",

        props: {
            disabled: Boolean,
            item: Object,
        },

        methods: {
            async remove() {
                const config = await this.$hoobs.config.get();

                config.dashboard = config.dashboard || {};
                config.dashboard.items = config.dashboard.items || [];

                const index = config.dashboard.items.findIndex((item) => item.component === "accessory-widget" && item.i === this.item.id);

                if (index >= 0) config.dashboard.items.splice(index, 1);

                await this.$hoobs.config.update(config);
                await Wait();

                this.$action.emit("dashboard", "update");
            },
        },
    };
</script>

<style lang="scss" scoped>
    #control {
        width: 100%;
        display: flex;
        flex-direction: column;

        .item {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            position: relative;
        }

        .name {
            text-align: center;
            padding: 14px 7px 7px 7px;
        }

        .remove {
            display: flex;
            position: absolute;
            justify-content: space-around;
            align-items: center;
            padding: 3px;
            top: 2px;
            right: 2px;
            cursor: pointer;

            .icon {
                height: 22px;
                opacity: 0.3;
            }

            &:hover {
                .icon {
                    opacity: 1;
                }
            }
        }

        .background {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            top: 0;
            left: 0;
        }

        .panel {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 11px 11px 10px 10px;
            display: flex;
            flex-direction: column;
            border-radius: 7px;
            background: var(--accessory-background);
            border: 1px var(--accessory-border) solid;

            .main {
                flex: 1;
                margin: 0 auto;
                cursor: default;
            }
        }
    }
</style>
