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
    <div v-if="display" id="spinner">
        <div class="inner">
            <div class="grid">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="message" v-html="value" />
    </div>
</template>

<script>
    export default {
        name: "spinner",

        props: {
            value: String,
        },

        data() {
            return {
                display: false,
            };
        },

        mounted() {
            setTimeout(() => {
                this.display = true;
            }, 500);
        },
    };
</script>

<style lang="scss" scoped>
    @-webkit-keyframes grid-beat {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.35;
        }
        100% {
            opacity: 1;
        }
    }

    @-moz-keyframes grid-beat {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.35;
        }
        100% {
            opacity: 1;
        }
    }

    @-o-keyframes grid-beat {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.35;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes grid-beat {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.35;
        }
        100% {
            opacity: 1;
        }
    }

    #spinner {
        height: 50%;
        display: inline-flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        user-select: none;

        .message {
            margin: 14px 0 0 0;
            font-size: 17px;
            opacity: 0.7;
        }

        .inner {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-content: center;
            align-items: center;

            .grid {
                position: relative;
                box-sizing: border-box;
                display: block;
                font-size: 0;
                color: var(--application-highlight);
                width: 36px;
                height: 36px;

                > div {
                    position: relative;
                    box-sizing: border-box;
                    display: inline-block;
                    float: none;
                    background-color: currentColor;
                    border: 0 solid currentColor;
                    width: 8px;
                    height: 8px;
                    margin: 2px;
                    border-radius: 100%;
                    animation-name: grid-beat;
                    animation-iteration-count: infinite;

                    &:nth-child(1) {
                        animation-duration: 0.65s;
                        animation-delay: 0.03s;
                    }

                    &:nth-child(2) {
                        animation-duration: 1.02s;
                        animation-delay: 0.09s;
                    }

                    &:nth-child(3) {
                        animation-duration: 1.06s;
                        animation-delay: -0.69s;
                    }

                    &:nth-child(4) {
                        animation-duration: 1.5s;
                        animation-delay: -0.41s;
                    }

                    &:nth-child(5) {
                        animation-duration: 1.6s;
                        animation-delay: 0.04s;
                    }

                    &:nth-child(6) {
                        animation-duration: 0.84s;
                        animation-delay: 0.07s;
                    }

                    &:nth-child(7) {
                        animation-duration: 0.68s;
                        animation-delay: -0.66s;
                    }

                    &:nth-child(8) {
                        animation-duration: 0.93s;
                        animation-delay: -0.76s;
                    }

                    &:nth-child(9) {
                        animation-duration: 1.24s;
                        animation-delay: -0.76s;
                    }
                }
            }
        }
    }
</style>
