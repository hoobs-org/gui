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
                    <div class="backdrop" :style="`background-image: ${working.backdrop};`">
                        <div class="display dark" :style="`background: ${working.application.background}; box-shadow: ${working.elevation.default};`">
                            <div class="title" :style="`color: ${working.application.highlight};`">{{ $t("title") }}</div>
                            <div class="accent" :style="`color: ${working.application.accent};`">{{ $t("accent") }}</div>
                            <div class="text" :style="`color: ${working.application.text.default};`">{{ $t("text") }}</div>
                        </div>
                        <div class="display light" :style="`background: ${working.modal.background}; backdrop-filter: ${working.transparency}; box-shadow: ${working.elevation.default};`">
                            <div class="title" :style="`color: ${working.modal.highlight};`">{{ $t("title") }}</div>
                            <div class="text" :style="`color: ${working.modal.text.default};`">{{ $t("text") }}</div>
                        </div>
                        <div class="display navigation" :style="`background: ${working.navigation.background};`">
                            <span class="icon" :style="`color: ${working.navigation.highlight};`">dashboard</span>
                            <span class="icon" :style="`color: ${working.navigation.text.default};`">highlight</span>
                            <span class="icon" :style="`color: ${working.navigation.text.default};`">subject</span>
                            <span class="icon" :style="`color: ${working.navigation.text.default};`">layers</span>
                            <span class="icon" :style="`color: ${working.navigation.text.default};`">extension</span>
                        </div>
                    </div>
                    <div class="backdrops">
                        <div class="row">
                            <backdrop image="default.jpg" v-model="working.backdrop" />
                            <backdrop image="amber.jpg" v-model="working.backdrop" />
                        </div>
                        <div class="row">
                            <backdrop image="purple.jpg" v-model="working.backdrop" />
                            <backdrop image="pink.jpg" v-model="working.backdrop" />
                        </div>
                        <div class="row">
                            <backdrop image="teal.jpg" v-model="working.backdrop" />
                            <backdrop image="green.jpg" v-model="working.backdrop" />
                        </div>
                        <div class="row">
                            <backdrop image="red.jpg" v-model="working.backdrop" />
                            <div v-on:click="$refs.backdrop.click();" class="add">
                                <input type="file" ref="backdrop" v-on:change="upload()" accept="image/*" hidden />
                                <span class="icon">add</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row title">
                    {{ $t("mode") }}
                </div>
                <div class="row">
                    <radio id="light" name="mode" v-model="mode" value="light">
                        <label for="light">{{ $t("light") }}</label>
                    </radio>
                </div>
                <div class="row">
                    <radio id="dark" name="mode" v-model="mode" value="dark">
                        <label for="dark">{{ $t("dark") }}</label>
                    </radio>
                </div>
                <div class="row title">
                    {{ $t("color") }}
                </div>
                <div class="row colors">
                    <div class="row">
                        <color v-model="highlight" name="yellow" color="#feb400" />
                        <color v-model="highlight" name="gold" color="#ff8c00" />
                        <color v-model="highlight" name="orange" color="#f7630c" />
                        <color v-model="highlight" name="orange-dark" color="#ca5010" />
                        <color v-model="highlight" name="rust" color="#da3b01" />
                        <color v-model="highlight" name="rust-light" color="#ef6950" />
                        <color v-model="highlight" name="brick" color="#d13438" />
                        <color v-model="highlight" name="brick-light" color="#ff4343" />
                        <color v-model="highlight" name="red-light" color="#e74856" />
                        <color v-model="highlight" name="red" color="#e81123" />
                        <color v-model="highlight" name="rose-light" color="#ea005e" />
                        <color v-model="highlight" name="rose" color="#c30052" />
                        <color v-model="highlight" name="plum-light" color="#e3008c" />
                        <color v-model="highlight" name="plum" color="#bf0077" />
                        <color v-model="highlight" name="orchid-light" color="#c239b3" />
                        <color v-model="highlight" name="orchid" color="#9a0089" />
                        <color v-model="highlight" name="violet" color="#881798" />
                    </div>
                    <div class="row">
                        <color v-model="highlight" name="olive" color="#498205" />
                        <color v-model="highlight" name="green-dark" color="#107c10" />
                        <color v-model="highlight" name="green" color="#10893e" />
                        <color v-model="highlight" name="green-light" color="#00cc6a" />
                        <color v-model="highlight" name="mint-dark" color="#018574" />
                        <color v-model="highlight" name="mint" color="#00b294" />
                        <color v-model="highlight" name="teal" color="#038387" />
                        <color v-model="highlight" name="seafoam" color="#00b7c3" />
                        <color v-model="highlight" name="cool-dark" color="#2d7d9a" />
                        <color v-model="highlight" name="cool" color="#0099bc" />
                        <color v-model="highlight" name="blue" color="#0078d7" />
                        <color v-model="highlight" name="navy" color="#0063b1" />
                        <color v-model="highlight" name="purple-light" color="#8e8cd8" />
                        <color v-model="highlight" name="purple" color="#6b69d6" />
                        <color v-model="highlight" name="iris-light" color="#8764b8" />
                        <color v-model="highlight" name="iris" color="#744da9" />
                        <color v-model="highlight" name="violet-light" color="#b146c2" />
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
    import Color from "../elements/color.vue";
    import Backdrop from "../elements/backdrop.vue";

    export default {
        name: "personalize",

        components: {
            "color": Color,
            "backdrop": Backdrop,
        },

        props: {
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                loading: true,
                highlight: "",
                original: {},
                working: {},
                mode: "",
            };
        },

        async mounted() {
            this.original = await this.hoobs.theme.get(this.$store.state.theme);
            this.working = JSON.parse(JSON.stringify(this.original));
            this.highlight = this.working.color;
            this.mode = this.working.mode;
            this.loading = false;
        },

        watch: {
            highlight() {
                if (!this.loading) {
                    this.colors(this.highlight);
                }
            },

            async mode() {
                if (!this.loading) {
                    const { backdrop } = this.working;

                    this.original = await this.hoobs.theme.get(this.mode);
                    this.working = JSON.parse(JSON.stringify(this.original));
                    this.working.backdrop = backdrop;

                    this.colors(this.highlight);
                    this.dirty();
                }
            },

            backdrop() {
                if (!this.loading) {
                    this.dirty();
                }
            },
        },

        methods: {
            async save() {
                this.loading = true;

                if (this.working.name !== "light" && this.working.name !== "dark") {
                    await this.hoobs.theme.save(this.working.display, this.working);
                }

                this.$theme(this.working.name);
                this.close();
            },

            dirty() {
                if (JSON.stringify(this.working) !== JSON.stringify(this.original)) {
                    this.working.name = "custom";
                    this.working.display = "Custom";

                    return true;
                }

                return false;
            },

            colors(value) {
                let highlight = "#feb400";
                let accent = "#e3954b";

                switch (value) {
                    case "gold":
                        this.working.color = value;

                        highlight = "#ff8c00";
                        accent = "#e3724b";
                        break;

                    case "orange":
                        this.working.color = value;

                        highlight = "#f7630c";
                        accent = "#e3564b";
                        break;

                    case "orange-dark":
                        this.working.color = value;

                        highlight = "#ca5010";
                        accent = "#e3544b";
                        break;

                    case "rust":
                        this.working.color = value;

                        highlight = "#da3b01";
                        accent = "#e34b58";
                        break;

                    case "rust-light":
                        this.working.color = value;

                        highlight = "#ef6950";
                        accent = "#e34b95";
                        break;

                    case "brick":
                        this.working.color = value;

                        highlight = "#d13438";
                        accent = "#bf5024";
                        break;

                    case "brick-light":
                        this.working.color = value;

                        highlight = "#ff4343";
                        accent = "#d134d1";
                        break;

                    case "red-light":
                        this.working.color = value;

                        highlight = "#e74856";
                        accent = "#ff895e";
                        break;

                    case "red":
                        this.working.color = value;

                        highlight = "#e81123";
                        accent = "#e87348";
                        break;

                    case "rose-light":
                        this.working.color = value;

                        highlight = "#ea005e";
                        accent = "#b910e8";
                        break;

                    case "rose":
                        this.working.color = value;

                        highlight = "#c30052";
                        accent = "#";
                        break;

                    case "plum-light":
                        this.working.color = value;

                        highlight = "#e3008c";
                        accent = "#9c240b";
                        break;

                    case "plum":
                        this.working.color = value;

                        highlight = "#bf0077";
                        accent = "#8100c2";
                        break;

                    case "orchid-light":
                        this.working.color = value;

                        highlight = "#c239b3";
                        accent = "#8038c2";
                        break;

                    case "orchid":
                        this.working.color = value;

                        highlight = "#9a0089";
                        accent = "#8038c2";
                        break;

                    case "violet":
                        this.working.color = value;

                        highlight = "#881798";
                        accent = "#6738c2";
                        break;

                    case "violet-light":
                        this.working.color = value;

                        highlight = "#b146c2";
                        accent = "#c2536e";
                        break;

                    case "iris":
                        this.working.color = value;

                        highlight = "#744da9";
                        accent = "#8c508f";
                        break;

                    case "iris-light":
                        this.working.color = value;

                        highlight = "#8764b8";
                        accent = "#9c659e";
                        break;

                    case "purple":
                        this.working.color = value;

                        highlight = "#6b69d6";
                        accent = "#638eb8";
                        break;

                    case "purple-light":
                        this.working.color = value;

                        highlight = "#8e8cd8";
                        accent = "#4e1d73";
                        break;

                    case "navy":
                        this.working.color = value;

                        highlight = "#0063b1";
                        accent = "#8dd9d1";
                        break;

                    case "blue":
                        this.working.color = value;

                        highlight = "#0078d7";
                        accent = "#00d6c5";
                        break;

                    case "cool":
                        this.working.color = value;

                        highlight = "#0099bc";
                        accent = "#00d687";
                        break;

                    case "cool-dark":
                        this.working.color = value;

                        highlight = "#2d7d9a";
                        accent = "#b0c0ff";
                        break;

                    case "seafoam":
                        this.working.color = value;

                        highlight = "#00b7c3";
                        accent = "#b0faff";
                        break;

                    case "teal":
                        this.working.color = value;

                        highlight = "#038387";
                        accent = "#05719e";
                        break;

                    case "mint":
                        this.working.color = value;

                        highlight = "#00b294";
                        accent = "#0abf3a";
                        break;

                    case "mint-dark":
                        this.working.color = value;

                        highlight = "#018574";
                        accent = "#069c5d";
                        break;

                    case "green-light":
                        this.working.color = value;

                        highlight = "#00cc6a";
                        accent = "#71e30b";
                        break;

                    case "green":
                        this.working.color = value;

                        highlight = "#10893e";
                        accent = "#61ede6";
                        break;

                    case "green-dark":
                        this.working.color = value;

                        highlight = "#107c10";
                        accent = "#7df07d";
                        break;

                    case "olive":
                        this.working.color = value;

                        highlight = "#498205";
                        accent = "#bcf07d";
                        break;

                    default:
                        this.working.color = "yellow";

                        highlight = "#feb400";
                        accent = "#e3954b";
                        break;
                }

                this.working.application.highlight = highlight;
                this.working.application.accent = accent;
                this.working.button.primary.background = highlight;
                this.working.button.primary.border = highlight;
                this.working.modal.highlight = highlight;
                this.working.navigation.text.active = highlight;
                this.working.navigation.highlight = highlight;

                this.dirty();
            },

            async upload() {
                const data = new FormData();

                data.append("file", this.$refs.backdrop.files[0]);

                const filename = await this.hoobs.theme.backdrop(data);

                let url = `:${window.location.port}/themes/${filename}`;

                if (process.env.NODE_ENV !== "production") {
                    url = `http://localhost:50826/themes/${filename}`;
                }

                this.working.backdrop = `url('${url}')`;

                this.dirty();
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
                display: flex;
                flex-direction: column;
                border: var(--modal-border) 1px solid;
                background: var(--modal-background);
                padding: 20px;
                margin: 10px 0 0 0;
                border-radius: 4px;

                .row {
                    display: flex;
                    flex-direction: row;

                    &.title {
                        padding: 20px 0 7px 0;

                        &:first-child {
                            padding: 0 0 7px 0;
                        }
                    }
                }
            }

            .backdrop {
                width: 470px;
                height: 263px;
                position: relative;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
                box-sizing: border-box;
                user-select: none;

                .display {
                    position: absolute;
                    width: 150px;
                    height: 200px;
                    box-sizing: border-box;

                    &.light {
                        top: 14px;
                        right: 14px;
                        padding: 10px;
                        border-radius: 3px;
                    }

                    &.dark {
                        top: 47px;
                        right: 114px;
                        padding: 10px;
                        border-radius: 3px;
                    }

                    .title {
                        font-size: 14px;
                    }

                    .accent {
                        font-size: 12px;
                    }

                    .text {
                        font-size: 12px;
                    }

                    &.navigation {
                        top: 0;
                        left: 0;
                        width: 20px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        .icon {
                            font-size: 12px;
                            margin: 10px 0 0 0;
                            box-sizing: border-box;
                        }
                    }
                }
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

                .add {
                    width: 104px;
                    height: 59px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    border: var(--modal-border) 1px solid;
                    box-sizing: border-box;
                    user-select: none;
                    cursor: pointer;

                    &:hover {
                        border: var(--modal-highlight) 1px solid;
                    }

                    .icon {
                        color: var(--modal-border);
                    }
                }
            }

            .colors {
                display: flex !important;
                flex-direction: column !important;

                .row {
                    height: 34px;
                    overflow: hidden;
                    margin: 0 0 7px 0;

                    &:last-child {
                        margin: 0;
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
