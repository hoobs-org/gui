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
    <div id="icon" class="form">
        <div class="row section">{{ $t("icon") }}</div>
        <form class="row icons" autocomplete="false" method="post" action="/login" v-on:submit.prevent="search()">
            <input type="submit" class="hidden-submit" value="submit" />
            <div class="search">
                <search-field id="query" ref="query" :title="$t('icon_search')" style="padding-right: 0;" v-model="query" v-on:search="search" :autofocus="true" />
                <div v-if="searching" class="loading">
                    <spinner />
                </div>
                <div v-else class="results">
                    <div v-for="(icon, index) in icons" :key="`icon:${index}`" class="icon" v-on:click="select(icon)">
                        <span :class="`mdi mdi-${icon}`"></span>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import catalog from "@/lang/icons.json";

    export default {
        name: "icons",

        data() {
            return {
                query: "",
                icons: [],
                searching: false,
            };
        },

        mounted() {
            this.search();
        },

        methods: {
            select(icon) {
                this.$emit("update", icon);
            },

            search() {
                if (!this.query || this.query === "") {
                    this.icons = catalog;

                    return;
                }

                this.searching = true;
                this.icons = catalog.filter((item) => item.indexOf(this.query.toLowerCase()) >= 0);
                this.searching = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #icon {
        overflow: hidden !important;

        .icons {
            margin: 0;
            flex: 1;
            overflow: hidden;

            .search {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .results {
                flex: 1;
                overflow: auto;
                -ms-overflow-style: none;
                scrollbar-width: none;

                &::-webkit-scrollbar {
                    display: none;
                }

                &.loading {
                    padding: 20px;
                    flex-direction: row;
                    justify-content: flex-start;
                }

                .icon {
                    width: 41px;
                    height: 41px;
                    display: inline-flex;
                    box-sizing: border-box;
                    flex-direction: row;
                    padding: 0;
                    color: var(--modal-text);
                    user-select: none;
                    cursor: pointer;

                    .mdi {
                        margin: 0 7px 7px 0;
                        font-size: 24px;
                        padding: 4px;
                        opacity: 0.7;
                        border: 1px var(--application-border) solid;
                    }

                    &:hover {
                        .mdi {
                            opacity: 1;
                            border: 1px var(--application-highlight) solid;
                        }
                    }
                }
            }
        }
    }
</style>
