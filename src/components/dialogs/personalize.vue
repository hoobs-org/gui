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
    <modal :title="$t('personalize')" :draggable="true" width="760px" height="687px">
        <div id="personalize">
            <div v-if="!loading" class="content">
                <div class="form">
                    <div v-if="auth" class="row title desktop-only">
                        {{ $t("login_image") }}
                    </div>
                    <div v-if="auth" class="row desktop-only">
                        <div class="backdrop" :style="`background-color: ${working.application.background}; background-image: ${backdrop};`">
                            <div class="display dark" :style="`background: ${working.application.background}; box-shadow: ${working.elevation.default};`">
                                <div v-if="!updating" class="title" :style="`color: ${working.application.highlight};`">{{ $t("title") }}</div>
                                <div v-if="!updating" class="accent" :style="`color: ${working.application.accent};`">{{ $t("accent") }}</div>
                                <div v-if="!updating" class="text" :style="`color: ${working.application.text.default};`">{{ $t("text") }}</div>
                            </div>
                            <div class="display light" :style="`background: ${working.modal.background}; backdrop-filter: ${working.transparency}; box-shadow: ${working.elevation.default};`">
                                <div v-if="!updating" class="title" :style="`color: ${working.modal.highlight};`">{{ $t("title") }}</div>
                                <div v-if="!updating" class="text" :style="`color: ${working.modal.text.default};`">{{ $t("text") }}</div>
                            </div>
                            <div class="display navigation" :style="`background: ${working.navigation.background};`">
                                <span v-if="!updating" class="icon" :style="`color: ${working.navigation.highlight};`">dashboard</span>
                                <span v-if="!updating" class="icon" :style="`color: ${working.navigation.text.default};`">highlight</span>
                                <span v-if="!updating" class="icon" :style="`color: ${working.navigation.text.default};`">subject</span>
                                <span v-if="!updating" class="icon" :style="`color: ${working.navigation.text.default};`">layers</span>
                                <span v-if="!updating" class="icon" :style="`color: ${working.navigation.text.default};`">extension</span>
                            </div>
                        </div>
                        <div class="backdrops">
                            <div class="row">
                                <backdrop image="default.jpg" v-model="backdrop" />
                                <backdrop image="amber.jpg" v-model="backdrop" />
                            </div>
                            <div class="row">
                                <backdrop image="purple.jpg" v-model="backdrop" />
                                <backdrop image="pink.jpg" v-model="backdrop" />
                            </div>
                            <div class="row">
                                <backdrop image="teal.jpg" v-model="backdrop" />
                                <backdrop image="green.jpg" v-model="backdrop" />
                            </div>
                            <div class="row">
                                <backdrop image="red.jpg" v-model="backdrop" />
                                <div v-on:click="$refs.backdrop.click();" class="add">
                                    <input type="file" ref="backdrop" v-on:change="upload()" accept="image/*" hidden />
                                    <span class="icon">add</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row title" style="margin-top: 20px;">
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
                    <div class="row title" style="margin-top: 20px;">
                        {{ $t("color") }}
                    </div>
                    <div v-if="auth" class="row auto desktop-only">
                        <checkbox id="auto" v-model="auto">
                            <label for="auto">{{ $t("automatically_set") }}</label>
                        </checkbox>
                    </div>
                    <div v-on:click="() => { auto = false; }" class="row colors">
                        <color v-for="(color, index) in colors" :key="index" v-model="highlight" :color="color" />
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div v-if="!loading" class="actions modal">
                <div class="button" v-on:click="close()">{{ $t("cancel") }}</div>
                <div class="button primary" v-on:click="save()">{{ $t("apply") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    import ColorScheme from "color-scheme";
    import ColorExtractor from "colorthief/dist/color-thief";
    import Color from "../elements/color.vue";
    import Colors from "../../services/colors";
    import Backdrop from "../elements/backdrop.vue";

    const THEMES_URL = process.env.VUE_APP_THEMES || "/themes";

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
                updating: false,
                auth: false,
                auto: false,
                colors: Colors,
                backdrop: "",
                highlight: "",
                original: {},
                working: {},
                mode: "",
            };
        },

        async mounted() {
            this.auth = await this.$hoobs.auth.status() === "enabled";
            this.original = await this.$hoobs.theme.get(this.$store.state.theme);
            this.working = JSON.parse(JSON.stringify(this.original));

            this.auto = this.working.auto;
            this.mode = this.working.mode;

            this.backdrop = this.working.backdrop;
            this.highlight = this.working.auto ? "auto" : this.working.application.highlight;

            if (this.auto) await this.extract();

            this.loading = false;
        },

        watch: {
            highlight(updated, current) {
                if (current && current !== "" && !this.loading && this.highlight !== "auto") this.adjust(this.highlight);
            },

            async mode(updated, current) {
                if (current && current !== "" && !this.loading && !this.updating) {
                    this.updating = true;

                    const { backdrop } = this.working;
                    const { auto } = this.working;

                    this.original = await this.$hoobs.theme.get(this.mode);
                    this.working = JSON.parse(JSON.stringify(this.original));

                    this.working.backdrop = backdrop;
                    this.working.auto = auto;

                    this.highlight = this.working.auto ? "auto" : this.working.application.highlight;

                    if (this.auto) await this.extract();
                    if (!this.auto) this.adjust(this.highlight);

                    this.updating = false;
                    this.dirty();
                }
            },

            async backdrop(updated, current) {
                if (current && current !== "") {
                    this.working.backdrop = this.backdrop;

                    if (!this.loading && this.auto) await this.extract();
                    if (!this.loading) this.dirty();
                }
            },

            async auto() {
                if (!this.loading) await this.extract();
            },
        },

        methods: {
            async save() {
                this.loading = true;

                if (this.working.name !== "light" && this.working.name !== "dark") await this.$hoobs.theme.save(this.working.display, this.working);

                this.$theme.set(this.working.name);
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

            contrast(value) {
                const scheme = new ColorScheme();

                scheme.from_hex(value.replace("#", "").toUpperCase());
                scheme.scheme("contrast");
                scheme.variation("hard");

                return `#${scheme.colors()[0]}`;
            },

            adjust(value) {
                const color = value.toLowerCase();

                this.working.application.highlight = color;
                this.working.application.accent = this.contrast(color);
                this.working.button.primary.background = color;
                this.working.button.primary.border = color;
                this.working.modal.highlight = color;
                this.working.navigation.text.active = color;
                this.working.navigation.highlight = color;

                this.dirty();
            },

            extract() {
                return new Promise((resolve) => {
                    if (this.auto) {
                        const extractor = new ColorExtractor();
                        const element = document.createElement("img");

                        element.src = this.backdrop.replace("url('", "").replace("')", "");
                        element.crossOrigin = "Anonymous";
                        element.style.display = "none";

                        element.addEventListener("load", () => {
                            const color = extractor.getColor(element).map((item) => item.toString(16)).map((item) => (item.length === 1 ? `0${item}` : item)).join("");
                            const scheme = new ColorScheme();

                            scheme.from_hex(color.replace("#", "").toUpperCase());
                            scheme.scheme("triade");
                            scheme.variation("soft");

                            element.remove();

                            const accent = `#${scheme.colors()[0]}`;
                            const highlight = this.contrast(`#${scheme.colors()[0]}`);

                            this.working.auto = true;
                            this.highlight = "auto";

                            this.working.application.highlight = highlight;
                            this.working.application.accent = accent;
                            this.working.button.primary.background = highlight;
                            this.working.button.primary.border = highlight;
                            this.working.modal.highlight = highlight;
                            this.working.navigation.text.active = highlight;
                            this.working.navigation.highlight = highlight;

                            this.dirty();

                            resolve();
                        });

                        element.addEventListener("error", () => {
                            element.remove();

                            this.auto = false;

                            resolve();
                        });

                        document.body.appendChild(element);
                    } else {
                        this.working.auto = false;

                        resolve();
                    }
                });
            },

            async upload() {
                this.backdrop = `url('${THEMES_URL}/${(await this.$hoobs.theme.backdrop(this.$refs.backdrop.files[0]))}')`;
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

        .auto {
            margin: 0 0 7px 0;
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
                }

                &.dark {
                    top: 47px;
                    right: 114px;
                    padding: 10px;
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
            display: flex;
            flex-wrap: wrap;

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
</style>
