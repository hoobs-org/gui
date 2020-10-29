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
    <div id="menu">
        <div v-if="auth" class="profile">
            <span class="icon">account_circle</span>
            <div class="details">
                <span class="title">{{ $t("current_user") }}</span>
                <span class="identity">{{ user.name || user.username }}</span>
            </div>
        </div>
        <div class="seperator"></div>
        <div v-on:click="about()" class="item">{{ $t("about") }}</div>
        <div v-on:click="help()" class="item">{{ $t("help") }}</div>
        <div class="seperator"></div>
        <div v-on:click="logout()" class="item">{{ $t("logout") }}</div>
    </div>
</template>

<script>
    export default {
        name: "service-menu",

        props: {
            about: Function,
            help: Function,
            logout: Function,
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
            this.auth = await this.hoobs.auth.status() === "enabled";
        },
    };
</script>

<style lang="scss" scoped>
    #menu {
        min-width: 197px;
        position: absolute;
        top: 41px;
        right: 14px;
        display: flex;
        flex-direction: column;
        color: var(--menu-text);
        background: var(--menu-background);
        backdrop-filter: blur(4px);
        border-radius: 4px;
        z-index: 300;
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.4),
            0 4px 5px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.7);

        .seperator {
            height: 1px;
            margin: 0 10px;
            background: var(--menu-border);
        }

        .item {
            padding: 10px 20px;
            color: var(--menu-text);
            display: block;
            text-decoration: none;
            cursor: pointer;
            user-select: none;

            &:last-child {
                border-radius: 0 0 4px 4px;
            }

            &:link {
                color: var(--menu-text);
                text-decoration: none;
            }

            &:active {
                color: var(--menu-text);
                text-decoration: none;
            }

            &:visited {
                color: var(--menu-text);
                text-decoration: none;
            }

            &:hover {
                background: var(--menu-highlight);
                text-decoration: none;
                color: var(--menu-highlight-text);
            }

            &.disabled {
                opacity: 0.4;
                cursor: default;

                &:hover {
                    background: unset;
                    text-decoration: none;
                    color: var(--menu-text);
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
                color: var( --application-highlight);
                margin: 0 14px 0 0;
                font-size: 42px;
            }

            .title {
                font-size: 14px;
            }

            .identity {
                color: var( --application-highlight);
                font-size: 17px;
            }

            .details {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>
