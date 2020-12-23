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
    <div v-if="user.permissions.plugins" id="plugins">
        <context />
        <div class="content">
            <list value="id" display="display" :values="instances" :selected="id" initial="library" controller="plugins" />
            <div v-if="id && id !== 'library'" class="screen">
                <div class="nav mobile">
                    <router-link to="/plugins" class="back"><span class="icon">keyboard_arrow_left</span> {{ $t("back") }}</router-link>
                </div>
                <div class="section">{{ $t("installed_plugins") }}</div>
                <div class="wrapper">
                    <div v-if="installed.length > 0" class="cards">
                        <plugin v-for="(plugin, index) in installed" :key="index" :subject="plugin" />
                    </div>
                    <div v-else-if="!loading" class="empty">
                        <div class="message">
                            {{ $t("no_plugins_installed") }}
                        </div>
                    </div>
                    <div v-else class="loading">
                        <spinner />
                    </div>
                </div>
            </div>
            <div v-else :class="!id ? 'screen desktop' : 'screen'">
                <div class="nav mobile">
                    <router-link to="/plugins" class="back"><span class="icon">keyboard_arrow_left</span> {{ $t("back") }}</router-link>
                </div>
                <form class="input" autocomplete="false" method="post" action="/login" v-on:submit.prevent="search()">
                    <input type="submit" class="hidden-submit" value="submit" />
                    <div class="search">
                        <search-field id="query" ref="query" style="padding-right: 0;" :placeholder="$t('search')" v-model="query" :search="search" />
                    </div>
                </form>
                <div class="wrapper">
                    <div v-if="featured.length > 0" class="section">{{ $t("featured_plugins") }}</div>
                    <div v-if="featured.length > 0" class="cards">
                        <plugin v-for="(plugin, index) in featured" :key="index" :subject="plugin" />
                    </div>
                    <div v-if="popular.length > 0" class="section">{{ $t("popular_plugins") }}</div>
                    <div v-if="popular.length > 0" class="cards">
                        <plugin v-for="(plugin, index) in popular" :key="index" :subject="plugin" />
                    </div>
                    <div v-if="results.length > 0" class="section">{{ $t("search_results") }}</div>
                    <div v-if="results.length > 0" class="cards">
                        <plugin v-for="(plugin, index) in results" :key="index" :subject="plugin" />
                    </div>
                    <div v-if="!loading && featured.length === 0 && popular.length === 0 && results.length === 0" class="empty">
                        <div class="message">
                            {{ $t("no_results") }}
                        </div>
                    </div>
                    <div v-if="loading" class="loading">
                        <spinner />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import List from "../components/elements/list.vue";
    import Plugin from "../components/elements/plugin.vue";

    export default {
        name: "plugins",

        props: {
            id: String,
        },

        components: {
            "list": List,
            "plugin": Plugin,
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                loading: true,
                query: "",
                installed: [],
                instances: [],
                featured: [],
                popular: [],
                results: [],
            };
        },

        watch: {
            id(value) {
                this.load(value);
            },

            "$route": function route() {
                this.load(this.id);
            },
        },

        async mounted() {
            this.instances = await this.$hoobs.instances.list();

            this.instances.unshift({
                id: "library",
                display: this.$t("library"),
            });

            this.load(this.id);
        },

        methods: {
            async load(id) {
                this.loading = true;

                if (!this.$route.query.search || this.$route.query.search === "") {
                    this.query = "";
                    this.installed = [];
                    this.results = [];
                    this.featured = await this.$plugins.featured();
                    this.popular = await this.$plugins.popular();

                    if (id && id !== "") {
                        const instance = await this.$hoobs.instance(id);

                        if (instance) {
                            this.installed = await instance.plugins.list();
                        }
                    }
                } else {
                    this.query = decodeURIComponent(this.$route.query.search);
                    this.featured = [];
                    this.popular = [];

                    this.results = await this.$plugins.search(this.query, parseInt(this.$route.query.skip, 10) || 0, parseInt(this.$route.query.limit, 10) || 40);
                }

                this.loading = false;
            },

            async search() {
                if (!this.query || this.query === "") {
                    this.$router.push({ path: "/plugins/library" });
                } else {
                    this.$router.push({
                        path: "/plugins/library",
                        query: {
                            search: encodeURIComponent(this.query),
                            skip: parseInt(this.$route.query.skip, 10) || 0,
                            limit: parseInt(this.$route.query.limit, 10) || 40,
                        },
                    });
                }
            },
        },
    };
</script>

<style lang="scss">
    #plugins {
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .content {
            flex: 1;
            display: flex;
            overflow: hidden;

            .screen {
                flex: 1;
                display: flex;
                margin: 0 20px 10px 10px;
                -ms-overflow-style: none;
                overflow: auto;

                &::-webkit-scrollbar {
                    display: none;
                }

                .input {
                    background: var(--widget-background);
                    border: 1px var(--widget-background) solid;
                    margin: 0 0 20px 7px;
                    padding: 3px;

                    .field {
                        padding: 0;
                    }

                    input {
                        background: transparent;
                        border: 0 none;
                    }

                    .icon {
                        bottom: 7px;
                    }

                    &:focus-within {
                        border: 1px var(--widget-highlight) solid;
                    }
                }

                .wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    -ms-overflow-style: none;
                    overflow: auto;

                    &::-webkit-scrollbar {
                        display: none;
                    }
                }

                .section {
                    display: flex;
                    flex-direction: row;
                    padding: 20px 0 10px 0;
                    border-bottom: var(--application-border) 1px solid;
                    color: var(--application-highlight);
                    margin: 0 0 20px 10px;
                    user-select: none;

                    &:first-child {
                        padding: 0 0 10px 0;
                    }
                }

                .cards {
                    display: flex;
                    flex-wrap: wrap;
                }

                .nav {
                    display: flex;
                    flex-direction: row;
                    padding: 20px 0 10px 0;
                    border-bottom: var(--application-border) 1px solid;
                    margin: 0 0 0 7px;
                    user-select: none;

                    &:first-child {
                        padding: 0 0 10px 0;
                    }
                }
            }

            .empty {
                flex: 1;
                display: flex;
                flex-direction: row;
                padding: 0 20px 20% 20px;
                align-items: center;
                overflow: hidden;

                .message {
                    margin: 0 auto;
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #instances {
            .content {
                .screen {
                    padding: 0 20px 10px 20px;
                    margin: 0;
                }
            }
        }
    }
</style>
