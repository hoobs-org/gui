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
    <div v-if="!loading" id="control">
        <div class="item">
            <div class="switch">
                <div class="inner" v-on:click="off">
                    <span class="mdi mdi-power"></span>
                </div>
            </div>
        </div>
        <div class="name">{{ $t("all_off") }}</div>
    </div>
</template>

<script>
    export default {
        name: "off-accessory",

        props: {
            id: String,
        },

        data() {
            return {
                loading: true,
                room: null,
            };
        },

        async mounted() {
            this.room = await this.$hoobs.room(this.id);
            this.loading = false;
        },

        methods: {
            async off() {
                if (this.room) await this.room.set("off", true);
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

        .switch {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 3%;
            box-sizing: border-box;
            pointer-events: none;
            border: 2px var(--accessory-border) solid;
            border-radius: 50%;
            top: 0;
            left: 0;

            .inner {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                box-sizing: border-box;
                background: var(--accessory-background);
                pointer-events: all;
                border-radius: 50%;
                cursor: pointer;

                .mdi {
                    color: var(--accessory-text);
                    font-size: 400%;
                    font-size: 3vmax;
                }
            }

            &:hover {
                .inner {
                    background: var(--application-highlight);

                    .mdi {
                        color: var(--accessory-highlight);
                        opacity: 1;
                    }
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #control {
            .switch {
                .inner {
                    .mdi {
                        font-size: 400%;
                    }
                }
            }
        }
    }
</style>
