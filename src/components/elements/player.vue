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
    <div>
        <video ref="videoPlayer" class="video-js"></video>
    </div>
</template>

<script>
    import Video from "video.js";
    import "video.js/dist/video-js.css";

    export default {
        name: "player",

        props: {
            source: {
                type: String,
                require: true,
            },
        },

        data() {
            return {
                player: null,
            };
        },

        mounted() {
            this.player = Video(this.$refs.videoPlayer, {
                autoplay: "play",
                controls: true,
                sources: [
                    {
                        src: this.source,
                        type: "video/mp4",
                    },
                ],
            });
        },

        beforeDestroy() {
            if (this.player) this.player.dispose();
        },
    };
</script>

<style lang="scss">
    .video-js {
        width: 100%;
        height: 100%;
        border-radius: 7px;

        .vjs-tech {
            border-radius: 7px;
        }

        .vjs-big-play-button {
            width: 100%;
            height: 100%;
            background: transparent;
            top: 0;
            left: 0;
            border: 0 none;
            justify-content: space-around;
            align-items: center;
            align-content: center;
        }

        .vjs-icon-placeholder:before {
            position: unset !important;
            top: unset !important;
            left: unset !important;
            width: unset !important;
            height: unset !important;
        }

        .vjs-control-bar {
            background: transparent;
            transition: unset;
        }
    }
</style>
