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
    <div v-on:click="$menu.close()" id="authenticated">
        <navigation />
        <div class="screen">
            <slot />
            <component v-if="menu" :key="menu.name" :is="menu" :options="menu.options"></component>
        </div>
        <component v-for="(dialog) in dialogs" :key="dialog.name" :is="dialog" :options="dialog.options"></component>
    </div>
</template>

<script>
    import Navigation from "@/components/navigation.vue";

    export default {
        name: "authenticated",

        components: {
            "navigation": Navigation,
        },

        computed: {
            notifications() {
                return this.$store.state.notifications;
            },
        },

        data() {
            return {
                dialogs: [],
                menu: null,
                show: {
                    instances: false,
                    plugins: false,
                },
            };
        },

        async created() {
            this.$dialog.on("state", (dialogs) => {
                this.$menu.close();
                this.dialogs = dialogs;
            });

            this.$menu.on("open", (menu) => {
                this.menu = menu;
            });

            this.$menu.on("close", () => {
                this.menu = null;
            });

            this.$store.commit("AUTH:STATE", (await this.$hoobs.auth.status()));
        },
    };
</script>

<style lang="scss">
    #authenticated {
        width: 100%;
        height: 100%;
        display: flex;
        font-family: "Montserrat", sans-serif;
        color: var(--application-text);
        background: var(--application-background);
        overflow: hidden;

        .screen {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }

        .form {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;

            .spacer {
                margin: 7px 0 14px 0;
            }

            .grid {
                display: grid;
                grid-template-columns: auto auto;
            }

            .row {
                display: flex;
                flex-direction: row;

                &.section {
                    padding: 20px 0 10px 0;
                    border-bottom: var(--application-border) 1px solid;
                    color: var(--application-highlight);
                    margin: 0 0 20px 0;
                    user-select: none;

                    &:first-child {
                        padding: 0 0 10px 0;
                    }
                }

                &.actions {
                    padding: 20px 0 10px 0;
                    margin: 0;
                    user-select: none;

                    &:first-child {
                        padding: 0 0 10px 0;
                    }
                }

                &.title {
                    padding: 0 0 7px 0;
                    user-select: none;
                }
            }
        }

        .tray {
            position: absolute;
            top: 2px;
            right: 0;
            display: flex;
            padding: 0 0 0 10px;
            justify-content: flex-end;
            z-index: 1100;

            .icon {
                width: 28px;
                height: 28px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                border-radius: 100%;
                font-size: 20px;
                margin: 5px 0;
                cursor: pointer;

                .active {
                    font-size: 32px;
                    position: absolute;
                    right: 4px;
                    color: var(--application-error-text);
                }

                &:last-child {
                    margin: 5px 10px 5px 0;
                }

                &:hover {
                    color: var(--application-highlight-text);
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #authenticated {
            flex-direction: column;

            .form {
                padding: 0;
            }
        }
    }
</style>
