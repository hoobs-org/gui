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
        <navigation v-if="authenticated()" />
        <router-view class="view" />
    </div>
</template>

<script>
    import Navigation from "./components/navigation.vue";
    import Themes from "./services/themes";

    export default {
        components: {
            navigation: Navigation,
        },

        computed: {
            theme() {
                return this.$store.state.theme;
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

            authenticated() {
                return ([
                    "Login",
                    "Setup",
                ]).indexOf(this.$route.name) === -1;
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
        src: local("Montserrat Regular"),
             local("Montserrat-Regular"),
             url(./assets/montserrat.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
    }

    @font-face {
        font-family: "Montserrat Black";
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: local("Montserrat Black"),
             local("Montserrat-Black"),
             url(./assets/montserrat-black.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
    }

    @font-face {
        font-family: "Material Icons";
        font-style: normal;
        font-weight: 400;
        src: url(./assets/material.eot);
        src: local("Material Icons"),
             local("MaterialIcons-Regular"),
             url(./assets/material.woff2) format('woff2'),
             url(./assets/material.woff) format('woff'),
             url(./assets/material.ttf) format('truetype');
    }
</style>

<style lang="scss">
    html, body {
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
    }

    #app .button,
    #app .button:link,
    #app .button:active,
    #app .button:visited {
        background: var(--button);
        color: var(--button-text) !important;
        text-decoration: none !important;
        display: inline-block;
        border: 1px var(--button-border) solid;
        border-radius: 3px;
        padding: 10px;
        cursor: pointer;
        user-select: none;
        margin: 0 10px 0 0;
        white-space: pre;
    }

    #app .button.primary,
    #app .button.primary:link,
    #app .button.primary:active,
    #app .button.primary:visited {
        background: var(--button-primary);
        color: var(--button-primary-text) !important;
        border: 1px var(--button-primary-border) solid;
    }

    #app .button.light,
    #app .button.light:link,
    #app .button.light:active,
    #app .button.light:visited {
        background: var(--button-light);
        color: var(--button-light-text) !important;
        border: 1px var(--button-light-border) solid;
    }

    #app .button:hover {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24),
                    0 2px 1px -1px rgba(0, 0, 0, 0.22),
                    0 1px 3px 1px rgba(0, 0, 0, 0.3);
    }

    #app .view {
        flex: 1;
    }

    #app input {
        background: var(--application-input);
        color: var(--application-input-text);
        border: 1px var(--application-border) solid;
    }

    #app input:focus {
        border-color: var(--application-highlight);
    }

    #app .modal input {
        background: var(--modal-input);
        color: var(--modal-input-text);
        border: 1px var(--modal-border) solid;
    }

    #app .modal input:focus {
        border-color: var(--modal-highlight);
    }

    #app .m-chckbox--container {
        margin: 0 !important;
        height: 28px !important;
        min-height: 28px !important;
    }

    #app .m-chckbox--container label {
        user-select: none;
    }

    #app .m-chckbox--container .m-chckbox--group {
        background-color: var(--application-input);
        border: 1px var(--application-border) solid;
    }

    #app .m-chckbox--container.active .m-chckbox--group {
        background-color: var(--application-highlight) !important;
        border: 1px var(--application-highlight) solid !important;
    }

    #app .m-chckbox--ripple {
        display: none !important;
    }

    #app .m-chckbox--label {
        padding-left: 7px !important;
    }

    #app .modal .m-chckbox--container .m-chckbox--group {
        background-color: var(--modal-input);
        border: 1px var(--modal-border) solid;
    }

    #app .modal .m-chckbox--container.active .m-chckbox--group {
        background-color: var(--modal-highlight) !important;
        border: 1px var(--modal-highlight) solid !important;
    }

    #app .hidden-submit {
        width: 1px;
        height: 1px;
        overflow: hidden;
        opacity: 0;
        position: absolute;
    }
</style>
