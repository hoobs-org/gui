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
    <div id="context">
        <div class="page">
            <slot />
        </div>
        <div class="system">
            <div v-on:click.stop="$menu.open('notifications')" class="mdi mdi-bell-outline">
                <div v-if="notifications.length > 0" class="active">&bull;</div>
            </div>
            <div v-on:click.stop="$menu.open('application')" class="mdi mdi-dots-vertical"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "context",

        computed: {
            notifications() {
                return this.$store.state.notifications;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #context {
        height: 38px;
        background: var(--application-background);
        display: flex;
        flex-direction: row;
        align-content: center;

        .page {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-content: center;
            padding: 2px 0 0 7px;

            .mdi {
                font-size: 18px;
            }
        }

        .system {
            display: flex;
            flex-direction: row;
            align-content: center;
            padding: 2px 7px 0 0;

            .mdi {
                font-size: 20px;
            }
        }

        .seperator {
            width: 1px;
            height: 18px;
            background: var(--navigation-border);
            margin: 10px 7px;
        }

        .mdi {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: relative;
            border-radius: 100%;
            font-size: 18px;
            margin: 5px 0;
            cursor: pointer;

            .active {
                font-size: 32px;
                position: absolute;
                right: 4px;
                color: var(--application-error-text);
            }

            &:hover {
                color: var(--application-highlight-text);
            }
        }

        .button {
            height: auto;
            display: flex;
            flex-direction: row;
            align-content: center;
            background: var(--application-background);
            color: var(--application-text) !important;
            border: 0 none;
            font-size: 13px;
            padding: 0;
            margin: 5px 5px 5px 0;

            .mdi {
                margin: 0 -3px 0 0;
                font-size: 18px;
            }

            &:hover {
                color: var(--application-highlight-text) !important;
                box-shadow: none !important;
            }
        }
    }
</style>
