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
    <div v-on:click="resetMenus()" id="app" :theme="theme">
        <navigation v-if="authenticated()" />
        <div class="screen">
            <div v-if="authenticated()" class="header">
                <div v-on:click.stop="toggleNotifications()" class="icon">
                    notifications_none
                    <div v-if="notifications.length > 0" class="active">&bull;</div>
                </div>
                <div v-on:click.stop="toggleServiceMenu()" class="icon">more_vert</div>
            </div>
            <router-view class="view" />
        </div>
        <notifications v-if="showNotifications" v-model="showNotifications" />
        <service-menu v-if="showServiceMenu" :about="toggleAbout" :help="toggleHelp" :logout="logout" />
    </div>
</template>

<script>
    import Themes from "./services/themes";
    import Navigation from "./components/navigation.vue";
    import Notifications from "./components/notifications.vue";
    import ServiceMenu from "./components/menus/service.vue";

    export default {
        components: {
            "navigation": Navigation,
            "notifications": Notifications,
            "service-menu": ServiceMenu,
        },

        computed: {
            theme() {
                return this.$store.state.theme;
            },

            notifications() {
                return this.$store.state.notifications;
            },
        },

        data() {
            return {
                showNotifications: false,
                showServiceMenu: false,
                showAbout: false,
                showHelp: false,
            };
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

            async logout() {
                this.showServiceMenu = false;

                await this.hoobs.auth.logout();

                this.$router.push({ path: "/login", query: { url: "/" } });
            },

            resetMenus() {
                this.showNotifications = false;
                this.showServiceMenu = false;
            },

            toggleNotifications() {
                this.showServiceMenu = false;
                this.showNotifications = !this.showNotifications;
            },

            toggleServiceMenu() {
                this.showNotifications = false;
                this.showServiceMenu = !this.showServiceMenu;
            },

            toggleAbout() {
                this.showServiceMenu = false;
                this.showAbout = !this.showAbout;
            },

            toggleHelp() {
                this.showServiceMenu = false;
                this.showHelp = !this.showHelp;
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
                box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24),
                    0 2px 1px -1px rgba(0, 0, 0, 0.22),
                    0 1px 3px 1px rgba(0, 0, 0, 0.3);
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

        .screen {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: flex-end;

            .icon {
                width: 34px;
                height: 34px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                border-radius: 17px;
                margin: 7px 0;
                cursor: pointer;

                .active {
                    font-size: 32px;
                    position: absolute;
                    right: 4px;
                    color: var(--application-error-text);
                }

                &:last-child {
                    margin: 7px 7px 7px 0;
                }

                &:hover {
                    background: var(--application-input-accent);
                    color: var(--application-highlight-text);
                }
            }
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
    }
</style>
