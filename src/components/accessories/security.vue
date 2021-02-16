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
                    <div class="actions">
                        <div class="row">
                            <div class="cell on" v-if="state === 0">{{ $t("home") }}</div>
                            <div class="cell" v-else v-on:click="mode(0)">{{ $t("home") }}</div>
                            <div class="cell on" v-if="state === 1">{{ $t("away") }}</div>
                            <div class="cell" v-else v-on:click="mode(1)">{{ $t("away") }}</div>
                        </div>
                        <div class="row">
                            <div class="cell on" v-if="state === 2">{{ $t("night") }}</div>
                            <div class="cell" v-else v-on:click="mode(2)">{{ $t("night") }}</div>
                            <div class="cell on" v-if="state === 3">{{ $t("off") }}</div>
                            <div class="cell" v-else v-on:click="mode(3)">{{ $t("off") }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings">
                <span class="mdi mdi-cog"></span>
            </div>
            <div v-if="features.battery" class="battery">
                <div class="charge">
                    <span :class="`mdi mdi-${charge}`"></span>
                </div>
                <div class="frame">
                    <span class="mdi mdi-battery-outline"></span>
                </div>
            </div>
        </div>
        <div class="name">{{ accessory.name }}</div>
    </div>
</template>

<script>
    import Debounce from "lodash.debounce";

    const UPDATE_DELAY = 150;
    const LOCAL_DELAY = 1000;

    export default {
        name: "security-accessory",

        props: {
            disabled: Boolean,
            accessory: {
                type: Object,
                required: true,
            },
        },

        data() {
            return {
                state: 0,
                battery: 0,
                features: {
                    battery: false,
                },
                local: false,
                subject: null,
                updater: Debounce(() => {
                    if (!this.local) {
                        const battery = this.subject.characteristics.find((item) => item.type === "battery_level");

                        this.state = (this.subject.characteristics.find((item) => item.type === "security_system_target_state") || {}).value || 0;
                        this.battery = (battery || {}).value || 0;

                        if (battery) this.features.battery = true;
                    }
                }, UPDATE_DELAY),
            };
        },

        created() {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === "IO:ACCESSORY:CHANGE" && mutation.payload.data.accessory.accessory_identifier === this.accessory.accessory_identifier) {
                    this.subject = mutation.payload.data.accessory;
                    this.updater();
                }
            });
        },

        mounted() {
            this.subject = this.accessory;
            this.updater();
        },

        methods: {
            async mode(value) {
                this.local = true;

                const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);

                this.state = value;

                await accessory.set("security_system_target_state", value);

                setTimeout(() => { this.local = false; }, LOCAL_DELAY);
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

        .battery {
            position: absolute;
            border-radius: 50%;
            background: var(--widget-background);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 3px;
            top: -6px;
            left: -6px;
            cursor: pointer;

            .mdi {
                font-size: 22px;
                transform-origin: center;
                transform: rotate(90deg);
            }

            .charge {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: absolute;
                color: #17eb50;
                top: 0;
                left: 0;
            }

            .frame {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: absolute;
                color: var(--accessory-border);
                top: 0;
                left: 0;
            }
        }

        .settings {
            display: none;
            position: absolute;
            border-radius: 50%;
            background: var(--widget-background);
            justify-content: space-around;
            align-items: center;
            padding: 3px;
            top: -6px;
            right: -6px;
            cursor: pointer;

            .mdi {
                font-size: 22px;
                opacity: 0.3;
            }

            &:hover {
                .mdi {
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
            height: 70%;
            margin: 3% 0 0 0;
            box-sizing: border-box;
            padding: 11px 11px 10px 10px;
            display: flex;
            flex-direction: column;
            border-radius: 7px;
            border: 2px var(--accessory-border) solid;

            .actions {
                flex: 1;
                display: flex;
                flex-direction: column;

                .row {
                    flex: 1;
                    display: flex;
                    flex-direction: row;

                    .cell {
                        flex: 1;
                        background: var(--accessory-background);
                        border: 1px var(--accessory-border) solid;
                        border-radius: 0 0 3px 0;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-around;
                        color: var(--accessory-text);
                        font-size: 14px;
                        overflow: hidden;
                        cursor: pointer;

                        margin-right: -1px;
                        margin-bottom: -1px;
                        z-index: 1;

                        &:first-child {
                            margin-left: -1px;
                            border-radius: 0 0 0 3px;
                        }

                        &.on {
                            border: 1px var(--application-highlight) solid;
                            background: var(--application-highlight);
                            color: var(--accessory-highlight);
                            z-index: 10;
                        }
                    }

                    &:first-child {
                        .cell {
                            margin-top: -1px;
                            margin-right: -1px;
                            margin-bottom: -1px;
                            border-radius: 0 3px 0 0;

                            &:first-child {
                                margin-left: -1px;
                                border-radius: 3px 0 0 0;
                            }
                        }
                    }
                }
            }
        }

        &:hover {
            .settings {
                display: flex;
            }
        }
    }
</style>
