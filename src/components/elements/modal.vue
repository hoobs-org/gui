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
    <div v-on:click.stop id="dialog">
        <div class="window modal" :style="`width: ${width}; height: ${height};`">
            <div v-if="title" class="subject">{{ title }}</div>
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: "modal",

        props: {
            title: String,
            width: {
                type: String,
                default: "auto",
            },
            height: {
                type: String,
                default: "auto",
            },
        },
    };
</script>

<style lang="scss">
    #dialog {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        background: var(--modal-mask);
        justify-content: space-around;
        padding: 20px 20px 10em 20px;
        z-index: 2000;

        .subject {
            color: var(--modal-highlight);
            text-shadow: 1px 1px 1px #00000033;
            font-weight: bold;
            font-size: 17px;
            padding: 10px 10px 0 10px;
            user-select: none;
        }

        .window {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 10px;
            color: var(--modal-text);
            background: var(--modal-background);
            backdrop-filter: var(--transparency);
            border-radius: 4px;
            box-shadow: var(--elevation);

            &:hover {
                overflow: overlay;
            }
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            overflow: hidden;
            margin: 0 10px 0 0;

            &.message {
                display: flex;
                justify-content: space-around;
                align-items: center;
                text-align: center;
                padding: 20px 10px;
                user-select: none;
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
                overflow: hidden;

                &:hover {
                    overflow: overlay;
                }

                .spacer {
                    margin: 7px 0 14px 0;
                }

                .row {
                    display: flex;
                    flex-direction: row;

                    &.section {
                        padding: 20px 0 10px 0;
                        border-bottom: var(--modal-border) 1px solid;
                        margin: 0 0 20px 0;
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
        }

        .actions {
            margin: 10px 0 10px 10px;
            display: flex;
            justify-content: flex-end;

            .copyright {
                flex: 1;
                font-size: 9px;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                user-select: none;
                opacity: 0.4;
            }
        }

        .loading {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 0 20% 0;
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #dialog {
            background: var(--modal-mobile);
            padding: 0;

            .window {
                flex: 1;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box;
                min-height: unset;
                max-height: unset;
                border-radius: unset;
                overflow: auto;
                box-shadow: unset;
            }

            .content {
                overflow: auto;

                .form {
                    border: unset;
                    background: unset;
                    padding: 0;
                    border-radius: unset;
                }
            }

            .actions {
                .copyright {
                    display: none;
                }
            }
        }
    }
</style>
