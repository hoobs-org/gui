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
    <iframe id="frame" ref="frame" :src="options.url" frameborder="0"></iframe>
</template>

<script>
    export default {
        name: "popup",

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
                    this.$refs.frame.contentWindow.$config = this.options.items;
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
    #frame {
        width: 1px;
        height: 1px;
        visibility: hidden;
    }
</style>
