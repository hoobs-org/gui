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
    <div id="app" :theme="theme">
        <navigation />
        <router-view class="view" />
    </div>
</template>

<script>
    import Navigation from "@/components/navigation.vue";

    import Themes from "./services/themes";

    export default {
        components: {
            navigation: Navigation,
        },

        computed: {
            theme() {
                return this.$store.state.theme;
            },
        },

        created() {
            this.setup(this.theme);
        },

        methods: {
            setup(theme) {
                if (theme !== this.theme) {
                    this.$store.commit("THEME:SET", theme);
                }

                document.getElementById("theme").setAttribute("href", Themes.path(theme));
            },
        },
    };
</script>

<style lang="scss">
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    }

    #app {
        width: 100%;
        height: 100%;
        display: flex;
        background: var(--application-background);
    }

    #app .view {
        flex: 1;
    }
</style>
