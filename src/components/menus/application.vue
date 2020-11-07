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
    <div v-on:click.stop id="menu">
        <div v-if="auth" class="profile">
            <span class="icon">account_circle</span>
            <div class="details">
                <span class="title">{{ $t("current_user") }}</span>
                <span class="identity">{{ user.name || user.username }}</span>
            </div>
        </div>
        <div v-if="auth" class="seperator desktop-only"></div>
        <div v-on:click="about()" class="item">{{ $t("about") }}</div>
        <div v-on:click="help()" class="item">{{ $t("help") }}</div>
        <div v-if="auth" class="seperator desktop-only"></div>
        <div v-on:click="settings()" class="item">{{ $t("settings") }}</div>
        <div v-on:click="personalize()" class="item">{{ $t("personalize") }}</div>
        <div v-on:click="terminal()" class="item desktop-only">{{ $t("terminal") }}</div>
        <div v-if="auth" class="seperator desktop-only"></div>
        <div v-if="auth" v-on:click="logout()" class="item">{{ $t("logout") }}</div>
        <div v-on:click="close()" class="icon close mobile-only">close</div>
    </div>
</template>

<script>
    export default {
        name: "service-menu",

        props: {
            about: {
                type: Function,
                default: () => { /* null */ },
            },
            help: {
                type: Function,
                default: () => { /* null */ },
            },
            settings: {
                type: Function,
                default: () => { /* null */ },
            },
            personalize: {
                type: Function,
                default: () => { /* null */ },
            },
            terminal: {
                type: Function,
                default: () => { /* null */ },
            },
            logout: {
                type: Function,
                default: () => { /* null */ },
            },
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                auth: false,
            };
        },

        async mounted() {
            this.auth = await this.$hoobs.auth.status() === "enabled";
        },
    };
</script>

<style lang="scss" scoped>
    #menu {
        min-width: 197px;
        position: absolute;
        top: 34px;
        right: 10px;
        display: flex;
        flex-direction: column;
        color: var(--menu-text);
        background: var(--menu-background);
        backdrop-filter: var(--transparency);
        box-shadow: var(--elevation);
        border-radius: 0;
        z-index: 3000;

        .seperator {
            height: 1px;
            margin: 0 10px;
            background: var(--menu-border);
        }

        .close {
            position: absolute;
            top: 14px;
            right: 14px;
            font-size: 17px;
            color: var(--application-text);
            cursor: pointer;
        }

        .item {
            padding: 10px 20px;
            display: block;
            color: var(--menu-text) !important;
            text-decoration: none !important;
            cursor: pointer;
            user-select: none;

            &:hover {
                background: var(--menu-highlight);
                color: var(--menu-highlight-text) !important;
            }

            &.disabled {
                opacity: 0.4;
                cursor: default;

                &:hover {
                    background: unset;
                    color: var(--menu-text) !important;
                }
            }
        }

        .profile {
            padding: 20px 20px 10px 20px;
            display: flex;
            align-items: center;
            align-content: center;
            color: var(--text);
            user-select: none;

            .icon {
                color: var(--application-highlight);
                margin: 0 14px 0 0;
                font-size: 47px;
            }

            .title {
                font-size: 14px;
            }

            .identity {
                color: var(--application-highlight);
                font-size: 17px;
            }

            .details {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #menu {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            min-width: unset;
            background: var(--application-background);
            color: var(--modal-text);
            top: 0;
            right: unset;
            left: 0;

            .item {
                color: var(--modal-text) !important;
                border-top: var(--modal-border) 1px solid;
                padding: 20px;

                &:first-child {
                    border-top: 0 none;
                }

                &:hover {
                    background: var(--menu-highlight);
                    color: var(--menu-highlight-text) !important;
                }

                &.disabled {
                    opacity: 0.4;
                    cursor: default;

                    &:hover {
                        background: unset;
                        color: var(--menu-text) !important;
                    }
                }
            }

            .profile {
                color: var(--modal-text);
            }
        }
    }
</style>
