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
    <modal-frame :draggable="true" width="760px" height="760px">
        <div id="plugin">
            <div class="content">
                <iframe ref="frame" :src="options.url" class="frame" frameborder="0"></iframe>
            </div>
            <div class="actions modal">
                <div class="button" v-on:click="$dialog.close('plugin')">{{ $t("cancel") }}</div>
            </div>
        </div>
    </modal-frame>
</template>

<script>
    export default {
        name: "plugin",

        components: {
            "modal-frame": () => import(/* webpackChunkName: "layout-frame" */ "@/components/elements/frame.vue"),
        },

        props: {
            options: Object,
        },

        mounted() {
            const fetch = () => this.options.value;
            const update = (response) => this.options.update(response);

            setTimeout(() => {
                this.$refs.frame.addEventListener("load", () => {
                    this.$refs.frame.contentWindow.$hoobs = this.$hoobs;
                    this.$refs.frame.contentWindow.$bridge = this.bridge;
                    this.$refs.frame.contentWindow.$close = () => { this.$dialog.close("plugin"); };

                    Object.defineProperty(this.$refs.frame.contentWindow, "$value", {
                        get: () => fetch(),
                        set: (response) => update(response),
                    });
                }, true);
            }, 10);
        },
    };
</script>

<style lang="scss" scoped>
    #plugin {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .frame {
            flex: 1;
        }

        .button {
            background: #f8f8f8 !important;
            color: #1a1a1a !important;
            border: 1px #dfdfdf solid !important;

            &:hover {
                box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2) !important;
            }
        }
    }
</style>
