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
    <div id="personalize">
        <div v-if="!loading" class="content">
            <div class="form">
                <div class="row title desktop-only">
                    {{ $t("backdrop") }}
                </div>
                <div class="row desktop-only">
                    <div class="backdrop" :style="`background-image: url('${backdrop}');`"></div>
                    <div class="backdrops">
                        <div class="row">
                            <div
                                v-on:click="select('default.jpg')"
                                :class="backdrop === `${path}default.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}default.jpg');`"
                            ></div>
                            <div
                                v-on:click="select('amber.jpg')"
                                :class="backdrop === `${path}amber.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}amber.jpg');`"
                            ></div>
                        </div>
                        <div class="row">
                            <div
                                v-on:click="select('purple.jpg')"
                                :class="backdrop === `${path}purple.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}purple.jpg');`"
                            ></div>
                            <div
                                v-on:click="select('pink.jpg')"
                                :class="backdrop === `${path}pink.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}pink.jpg');`"
                            ></div>
                        </div>
                        <div class="row">
                            <div
                                v-on:click="select('teal.jpg')"
                                :class="backdrop === `${path}teal.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}teal.jpg');`"
                            ></div>
                            <div
                                v-on:click="select('green.jpg')"
                                :class="backdrop === `${path}green.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}green.jpg');`"
                            ></div>
                        </div>
                        <div class="row">
                            <div
                                v-on:click="select('red.jpg')"
                                :class="backdrop === `${path}red.jpg` ? 'backdrop active' : 'backdrop'"
                                :style="`background-image: url('${path}red.jpg');`"
                            ></div>
                            <div v-on:click="$refs.backdrop.click();" class="backdrop add">
                                <input type="file" ref="backdrop" v-on:change="upload()" accept="image/*" hidden />
                                <span class="icon">add</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <spinner />
        </div>
        <div class="actions modal">
            <div class="button light" v-on:click="close()">{{ $t("cancel") }}</div>
            <div v-if="!loading" class="button primary" v-on:click="save()">{{ $t("apply") }}</div>
        </div>
    </div>
</template>

<script>
    import { sanitize } from "../../services/sdk";

    export default {
        name: "personalize",

        props: {
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                loading: true,
                name: "Custom",
                working: {},
                backdrop: "",
                path: "/defaults/backdrops/",
            };
        },

        async mounted() {
            this.working = await this.hoobs.theme.get(this.$store.state.theme);
            this.backdrop = this.working.backdrop.replace("url('", "").replace("')", "");
            this.loading = false;
        },

        methods: {
            async save() {
                this.loading = true;

                await this.hoobs.theme.save(this.name, this.working);

                this.$theme(sanitize(this.name));
                this.close();
            },

            select(image) {
                this.backdrop = `${this.path}${image}`;
                this.working.backdrop = `url('${this.backdrop}')`;
            },

            async upload() {
                const data = new FormData();

                data.append("file", this.$refs.backdrop.files[0]);

                const filename = await this.hoobs.theme.backdrop(data);

                let url = `:${window.location.port}/themes/${filename}`;

                if (process.env.NODE_ENV !== "production") {
                    url = `http://localhost:50826/themes/${filename}`;
                }

                this.backdrop = url;
                this.working.backdrop = `url('${this.backdrop}')`;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #personalize {
        flex: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        margin: 0 0 0 10px;

        .loading {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 0 20% 0;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            overflow: hidden;
            margin: 0 10px 0 0;

            &:hover {
                overflow: overlay;
            }

            .form {
                flex: 1;
                border: var(--modal-border) 1px solid;
                background: var(--modal-background);
                padding: 20px;
                margin: 10px 0 0 0;
                border-radius: 4px;

                .row {
                    display: flex;
                    flex-direction: row;

                    &.title {
                        padding: 0 0 7px 0;
                    }
                }
            }

            .backdrop {
                width: 470px;
                height: 263px;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
                box-sizing: border-box;
            }

            .backdrops {
                flex: 1;
                margin: 0 0 0 10px;
                overflow: hidden;

                .row {
                    height: 59px;
                    overflow: hidden;
                    margin: 0 0 9px 0;

                    &:last-child {
                        margin: 0;
                    }
                }

                .backdrop {
                    width: 104px;
                    height: 59px;
                    opacity: 0.6;
                    cursor: pointer;

                    &:first-child {
                        margin: 0 10px 0 0;
                    }

                    &:last-child {
                        margin: 0;
                    }

                    &:hover {
                        opacity: 0.8;
                    }

                    &.active {
                        border: var(--modal-highlight) 2px solid;
                        opacity: 1;
                    }

                    &.add {
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        border: var(--modal-border) 1px solid;
                        opacity: 1;

                        &:hover {
                            border: var(--modal-highlight) 1px solid;
                        }

                        .icon {
                            color: var(--modal-border);
                        }
                    }
                }
            }
        }

        .actions {
            margin: 10px 0 10px 10px;
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
