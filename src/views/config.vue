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
    <div v-if="user.permissions.config" id="config">
        <context />
        <div v-if="!loading" class="content">
            <list value="identifier" display="display" :values="plugins" :selected="identifier" initial="api" controller="config" />
            <div v-if="identifier && identifier !== 'api' && identifier !== 'advanced'" class="screen">
                <div class="wrapper">
                    <div class="section">{{ plugin.display }}</div>
                    <tabs :values="instances" v-on:change="change" :value="instance" field="id" display="display" class="tabs" />
                    <schema-form :schema="schema" v-model="current" />
                    <div class="row actions">
                        <router-link to="/config" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </div>
            <div v-else-if="identifier && identifier === 'advanced'" class="screen">
                <div class="wrapper">
                    <div class="section">{{ $t("advanced") }}</div>
                    <tabs :values="instances" v-on:change="change" :value="instance" field="id" display="display" class="tabs" />
                    <div class="row actions">
                        <router-link to="/config" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </div>
            <div v-else :class="!identifier ? 'screen desktop' : 'screen'">
                <div class="wrapper">
                    <div class="section">{{ $t("api") }}</div>
                    <div class="row actions">
                        <router-link to="/config" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <spinner />
        </div>
    </div>
</template>

<script>
    import List from "@/components/elements/list.vue";
    import Tabs from "@/components/elements/tabs.vue";
    import Form from "@/components/form.vue";

    export default {
        name: "config",

        props: {
            name: String,
            scope: String,
        },

        components: {
            "list": List,
            "tabs": Tabs,
            "schema-form": Form,
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        watch: {
            scope() {
                this.switch(this.name && this.name !== "" ? `${this.scope}/${this.name}` : this.scope);
            },
        },

        data() {
            return {
                loading: true,
                identifier: "",
                type: null,
                alias: null,
                schema: null,
                current: {},
                plugins: [],
                plugin: null,
                instances: [],
                instance: "",
            };
        },

        mounted() {
            this.load(this.name && this.name !== "" ? `${this.scope}/${this.name}` : this.scope);
        },

        methods: {
            change(instance) {
                this.instance = instance;
            },

            async switch(identifier) {
                this.loading = true;
                this.identifier = identifier;
                this.instances = [];
                this.schema = null;
                this.plugin = null;

                const waits = [];

                if (identifier && identifier !== "" && identifier !== "api" && identifier !== "advanced") {
                    this.plugin = this.plugins.find((item) => item.identifier === identifier);

                    if (this.plugin && this.plugin.schema && this.plugin.schema.schema) {
                        this.type = this.plugin.schema.pluginType;
                        this.alias = this.plugin.alias || this.plugin.schema.pluginAlias;

                        for (let i = 0; i < this.plugin.instances.length; i += 1) {
                            waits.push(new Promise((resolve) => {
                                this.$hoobs.instance(this.plugin.instances[i].id).then((instance) => {
                                    this.instances.push(instance);
                                }).finally(() => {
                                    resolve();
                                });
                            }));
                        }

                        switch (this.type) {
                            case "accessory":
                                this.schema = {
                                    type: "object",
                                    properties: {
                                        accessories: {
                                            type: "array",
                                            format: "root",
                                            items: {
                                                title: this.$t("accessory"),
                                                type: "object",
                                                properties: this.plugin.schema.schema.properties,
                                            },
                                        },
                                    },
                                };

                                break;

                            default:
                                this.schema = this.plugin.schema.schema;
                                break;
                        }
                    }
                } else if (identifier === "advanced") {
                    this.instances = await this.$hoobs.instances.list();
                }

                await Promise.all(waits);

                this.instances.sort((a, b) => {
                    if (a.id < b.id) return -1;
                    if (a.id > b.id) return 1;

                    return 0;
                });

                this.instance = ((this.instances || [])[0] || {}).id || "";
                this.loading = false;
            },

            async load(identifier) {
                this.loading = true;

                this.plugins = [{
                    identifier: "api",
                    display: this.$t("api"),
                }];

                const plugins = await this.$hoobs.plugins();

                for (let i = 0; i < plugins.length; i += 1) {
                    const plugin = plugins[i];

                    if (plugin && plugin.schema && plugin.schema.schema) {
                        const { instance } = plugin;
                        const { version } = plugin;

                        let index = this.plugins.findIndex((item) => item.identifier === plugin.identifier);

                        if (index === -1) {
                            index = this.plugins.length;
                            plugin.instances = [];
                            plugin.display = this.$repository.title(plugin.name);

                            delete plugin.instance;
                            delete plugin.version;

                            this.plugins.push(plugin);
                        }

                        this.plugins[index].instances.push({
                            id: instance,
                            version,
                        });
                    }
                }

                this.plugins.push({
                    identifier: "advanced",
                    display: this.$t("advanced"),
                });

                this.switch(identifier);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #config {
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
                margin: 0 20px 20px 20px;
                padding: 20px;
                color: var(--widget-text);
                background: var(--widget-background);
                backdrop-filter: var(--transparency);
                -ms-overflow-style: none;
                overflow: auto;

                &::-webkit-scrollbar {
                    display: none;
                }

                .section {
                    display: flex;
                    flex-direction: row;
                    padding: 0 0 10px 0;
                    border-bottom: var(--application-border) 1px solid;
                    color: var(--application-highlight);
                    margin: 0 0 20px 0;
                    user-select: none;
                }

                .wrapper {
                    max-width: 800px;
                }

                .tabs {
                    margin: 20px 0;
                }

                .actions {
                    margin: 10px 0 0 0;
                }
            }

            .initial {
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
        #config {
            .content {
                .screen {
                    max-width: unset;
                    background: transparent;
                    backdrop-filter: unset;
                    padding: 0 20px 10px 20px;
                    margin: 0;

                    .row {
                        flex-direction: column;
                    }

                    .actions {
                        flex-direction: row;
                    }
                }
            }
        }
    }
</style>
