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
    #spinner {
        height: 50%;
        display: inline-flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
    }

    #spinner .message {
        margin: 14px 0 0 0;
        font-size: 17px;
        opacity: 0.7;
    }

    #spinner .inner {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
    }

    #spinner .inner .grid,
    #spinner .inner .grid > div {
        position: relative;
        box-sizing: border-box;
    }

    #spinner .inner .grid {
        display: block;
        font-size: 0;
        color: var(--application-highlight);
    }

    #spinner .inner .grid > div {
        display: inline-block;
        float: none;
        background-color: currentColor;
        border: 0 solid currentColor;
    }

    #spinner .inner .grid {
        width: 36px;
        height: 36px;
    }

    #spinner .inner .grid > div {
        width: 8px;
        height: 8px;
        margin: 2px;
        border-radius: 100%;
        animation-name: grid-beat;
        animation-iteration-count: infinite;
    }

    #spinner .inner .grid > div:nth-child(1) {
        animation-duration: .65s;
        animation-delay: .03s;
    }

    #spinner .inner .grid > div:nth-child(2) {
        animation-duration: 1.02s;
        animation-delay: .09s;
    }

    #spinner .inner .grid > div:nth-child(3) {
        animation-duration: 1.06s;
        animation-delay: -.69s;
    }

    #spinner .inner .grid > div:nth-child(4) {
        animation-duration: 1.5s;
        animation-delay: -.41s;
    }

    #spinner .inner .grid > div:nth-child(5) {
        animation-duration: 1.6s;
        animation-delay: .04s;
    }

    #spinner .inner .grid > div:nth-child(6) {
        animation-duration: .84s;
        animation-delay: .07s;
    }

    #spinner .inner .grid > div:nth-child(7) {
        animation-duration: .68s;
        animation-delay: -.66s;
    }

    #spinner .inner .grid > div:nth-child(8) {
        animation-duration: .93s;
        animation-delay: -.76s;
    }

    #spinner .inner .grid > div:nth-child(9) {
        animation-duration: 1.24s;
        animation-delay: -.76s;
    }

    @-webkit-keyframes grid-beat {
        0% {
            opacity: 1;
        }
        50% {
            opacity: .35;
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
            opacity: .35;
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
            opacity: .35;
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
            opacity: .35;
        }
        100% {
            opacity: 1;
        }
    }
</style>
