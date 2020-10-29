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
        <div class="window" :style="`width: ${width}; height: ${height};`">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: "modal",

        props: {
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

<style lang="scss" scoped>
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

        .window {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 20px;
            color: var(--modal-text);
            background: var(--modal-background);
            backdrop-filter: blur(4px);
            border-radius: 4px;
            box-shadow: var(--elevation);

            &:hover {
                overflow: overlay;
            }
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
        }
    }
</style>
