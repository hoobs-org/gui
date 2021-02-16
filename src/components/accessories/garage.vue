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
            <div class="door">
                <div class="inner">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <path class="face" d="M50,16.5L9.1,38v49.3h81.8V38L50,16.5z" />
                        <polygon class="roof" points="5,35.2 50,12.7 95,35.2 95,41.3 95,43.4 50,20.9 5,43.4 5,41.3" />
                        <g v-if="open" v-on:click="toggle">
                            <rect fill="#787878" x="19.3" y="50.5" width="61.4" height="36.8" style="cursor: pointer;" />
                            <polygon fill="#686868" points="76.6,50.5 23.4,50.5 19.3,50.5 19.3,54.6 19.3,87.3 23.4,87.3 23.4,54.6 76.6,54.6 76.6,87.3  80.7,87.3 80.7,54.6 80.7,50.5" style="cursor: pointer;" />
                            <path fill="#999999" d="M80.7,66.9H19.3v-4.1h61.4V66.9z M80.7,71H19.3V75h61.4V71z M80.7,79.1H19.3v4.1h61.4V79.1z M80.7,54.6H19.3 v4.1h61.4V54.6z" style="cursor: pointer;" />
                            <path fill="#8a8a8a" d="M80.7,58.7h-4.1v-4.1h4.1V58.7z M80.7,62.8h-4.1v4.1h4.1V62.8z M80.7,71h-4.1V75h4.1V71z M80.7,79.1h-4.1v4.1 h4.1V79.1z M23.4,54.6h-4.1v4.1h4.1V54.6z M23.4,
                                                    62.8h-4.1v4.1h4.1V62.8z M23.4,71h-4.1V75h4.1V71z M23.4,79.1h-4.1v4.1h4.1V79.1z" style="cursor: pointer;" />
                        </g>
                        <g v-else v-on:click="toggle">
                            <rect fill="#686868" x="19.3" y="50.5" width="61.4" height="4.1" style="cursor: pointer;" />
                            <rect fill="#4f4f4f" x="19.3" y="54.6" width="61.4" height="32.7" style="cursor: pointer;" />
                            <rect fill="#999999" x="19.3" y="54.6" width="61.4" height="4.1" style="cursor: pointer;" />
                            <path fill="#8a8a8a" d="M80.7,58.7h-4.1v-4.1h4.1V58.7z M23.4,54.6h-4.1v4.1h4.1V54.6z" style="cursor: pointer;" />
                            <polygon fill="#333333" points="19.3,58.7 19.3,77.1 19.3,87.3 29.5,77.1 70.5,77.1 80.7,87.3 80.7,77.1 80.7,58.7" style="cursor: pointer;" />
                        </g>
                    </svg>
                    <div v-if="obstruction" class="mdi mdi-dog-side"></div>
                </div>
            </div>
            <div class="settings">
                <span class="mdi mdi-cog"></span>
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
        name: "garage-accessory",

        props: {
            disabled: Boolean,
            accessory: {
                type: Object,
                required: true,
            },
        },

        data() {
            return {
                open: false,
                obstruction: false,
                local: false,
                subject: null,
                updater: Debounce(() => {
                    if (!this.local) {
                        this.open = (this.subject.characteristics.find((item) => item.type === "target_door_state") || {}).value || false;
                        this.obstruction = (this.subject.characteristics.find((item) => item.type === "obstruction_detected") || {}).value || false;
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
            async toggle() {
                this.local = true;

                const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);
                const open = !this.open;

                this.open = open;

                await accessory.set("target_door_state", open);

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

        .door {
            width: 100%;
            height: 100%;
            position: absolute;
            box-sizing: border-box;
            pointer-events: none;
            top: 0;
            left: 0;

            .inner {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                position: relative;
                box-sizing: border-box;
                pointer-events: all;

                .mdi {
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    font-size: 300%;
                    bottom: 5%;
                }
            }

            svg {
                width: 100%;
                height: 100%;

                .face {
                    fill: var(--accessory-background);
                    stroke: var(--accessory-border);
                    stroke-width: 0.5;
                }

                .roof {
                    fill: var(--application-highlight);
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
