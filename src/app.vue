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
    <div id="app" :theme="theme">
        <router-view class="view" />
    </div>
</template>

<script>
    import Themes from "./services/themes";

    export default {
        computed: {
            theme() {
                return this.$store.state.theme;
            },

            notifications() {
                return this.$store.state.notifications;
            },
        },

        created() {
            this.setup(this.theme);
        },

        methods: {
            setup(theme) {
                if (theme !== this.theme) {
                    this.$store.commit("THEME:SET", theme);
                }

                document.getElementById("theme").setAttribute("href", Themes.path(theme));
            },
        },
    };
</script>

<style lang="scss">
    @font-face {
        font-family: "Montserrat";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Montserrat Regular"), local("Montserrat-Regular"),
            url(./assets/montserrat.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
            U+FE2E-FE2F;
    }

    @font-face {
        font-family: "Montserrat Black";
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: local("Montserrat Black"), local("Montserrat-Black"),
            url(./assets/montserrat-black.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
            U+FE2E-FE2F;
    }

    @font-face {
        font-family: "Material Icons";
        font-style: normal;
        font-weight: 400;
        src: url(./assets/material.eot);
        src: local("Material Icons"), local("MaterialIcons-Regular"),
            url(./assets/material.woff2) format("woff2"),
            url(./assets/material.woff) format("woff"),
            url(./assets/material.ttf) format("truetype");
    }
</style>

<style lang="scss">
    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    }

    #app {
        width: 100%;
        height: 100%;
        display: flex;
        font-family: "Montserrat", sans-serif;
        color: var(--application-text);
        background: var(--application-background);

        a {
            color: var(--application-highlight) !important;
            text-decoration: none !important;

            &:hover {
                text-decoration: underline !important;
            }
        }

        .button {
            background: var(--button);
            color: var(--button-text) !important;
            text-decoration: none !important;
            display: inline-block;
            border: 1px var(--button-border) solid;
            border-radius: 4px;
            padding: 10px;
            user-select: none;
            margin: 0 10px 0 0;
            white-space: pre;
            cursor: pointer;

            &.primary {
                background: var(--button-primary);
                color: var(--button-primary-text) !important;
                border: 1px var(--button-primary-border) solid;
            }

            &.light {
                background: var(--button-light);
                color: var(--button-light-text) !important;
                border: 1px var(--button-light-border) solid;
            }

            &:hover {
                box-shadow: var(--elevation-button);
            }
        }

        .icon {
            font-family: "Material Icons";
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            user-select: none;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-feature-settings: "liga";
            -webkit-font-smoothing: antialiased;
        }

        .view {
            flex: 1;
        }

        input {
            background: var(--application-input);
            color: var(--application-input-text);
            border: 1px var(--application-border) solid;

            &:focus {
                border-color: var(--application-highlight);
            }
        }

        .modal {
            input {
                background: var(--modal-input);
                color: var(--modal-input-text);
                border: 1px var(--modal-border) solid;

                &:focus {
                    border-color: var(--modal-highlight);
                }
            }
        }

        .m-chckbox--container {
            margin: 0 !important;
            height: 28px !important;
            min-height: 28px !important;

            label {
                user-select: none;
            }

            .m-chckbox--group {
                background-color: var(--application-input);
                border: 1px var(--application-border) solid;
            }

            &.active {
                .m-chckbox--group {
                    background-color: var(--application-highlight) !important;
                    border: 1px var(--application-highlight) solid !important;
                }
            }
        }

        .m-chckbox--ripple {
            display: none !important;
        }

        .m-chckbox--label {
            padding-left: 7px !important;
        }

        .modal {
            .m-chckbox--container {
                .m-chckbox--group {
                    background-color: var(--modal-input);
                    border: 1px var(--modal-border) solid;
                }

                &.active {
                    .m-chckbox--group {
                        background-color: var(--modal-highlight) !important;
                        border: 1px var(--modal-highlight) solid !important;
                    }
                }
            }
        }

        .hidden-submit {
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
            position: absolute;
        }

        .mobile-only {
            display: none !important;
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #app {
            .mobile-only {
                display: block !important;
            }

            .desktop-only {
                display: none !important;
            }
        }
    }
</style>
