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
                    <schema-form :instance="instance" :identifier="identifier" :schema="schema" v-model="working" />
                    <div class="row actions">
                        <div v-on:click="save" class="button primary">{{ $t("save") }}</div>
                        <router-link to="/config" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </div>
            <div v-else-if="identifier && identifier === 'advanced'" class="screen">
                <tabs v-if="instances.length > 0" :values="instances" v-on:change="change" :value="instance" field="id" display="display" class="tabs tight" />
                <div v-if="instances.length > 0" ref="editor" class="editor"></div>
                <div class="row actions">
                    <div v-if="instances.length > 0" v-on:click="save" class="button primary">{{ $t("save") }}</div>
                    <router-link to="/config" class="button">{{ $t("cancel") }}</router-link>
                </div>
            </div>
            <div v-else :class="!identifier ? 'screen desktop' : 'screen'">
                <div class="wrapper">
                    <div class="section">{{ $t("authentication") }}</div>
                    <div class="row">
                        <integer-field :title="$t('inactive_logoff')" :description="$t('inactive_logoff_description')" :min="5" :max="300" v-model="working.inactive_logoff" />
                    </div>
                    <div class="row">
                        <checkbox id="disable_auth" :title="$t('disable_auth')" v-model="working.disable_auth" />
                    </div>
                    <div class="section extra">{{ $t("monitor") }}</div>
                    <div class="row">
                        <integer-field :title="$t('update_interval')" :description="$t('update_interval_description')" :min="2" :max="300" v-model="working.polling_seconds" />
                    </div>
                    <div class="section">{{ $t("interface") }}</div>
                    <div class="row">
                        <text-field :title="$t('cors_orgin')" :description="$t('cors_orgin_description')" v-model="working.origin" />
                    </div>
                    <div class="row">
                        <text-field :title="$t('gui_path')" :description="$t('gui_path_description')" v-model="working.gui_path" />
                    </div>
                    <div class="row">
                        <text-field :title="$t('touch_path')" :description="$t('touch_path_description')" v-model="working.touch_path" />
                    </div>
                    <div class="row actions">
                        <div v-on:click="save" class="button primary">{{ $t("save") }}</div>
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

    const INSTANCE_RESTART_DELAY = 4000;

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
                working: {},
                plugins: [],
                plugin: null,
                instances: [],
                instance: "",
                editor: null,
            };
        },

        async created() {
            window.require.config({
                paths: { "vs": "/vs" },
            });

            await (new Promise((resolve) => {
                window.require(["/vs/editor/editor.main"], () => {
                    resolve();
                });
            }));
        },

        beforeRouteLeave(_to, _from, next) {
            this.$action.off("window", "resize");
            this.$action.off("personalize", "update");

            if (this.editor) {
                this.editor.dispose();
                this.editor = null;
            }

            next();
        },

        mounted() {
            this.$action.off("window", "resize");
            this.$action.off("personalize", "update");
            this.$action.on("window", "resize", this.resize);

            this.$action.on("personalize", "update", () => {
                if (this.identifier === "advanced") {
                    this.change(this.instance);
                }
            });

            this.load(this.name && this.name !== "" ? `${this.scope}/${this.name}` : this.scope);
        },

        methods: {
            async save() {
                this.loading = true;

                if (!this.identifier || this.identifier === "" || this.identifier === "api") {
                    const config = await this.$hoobs.config.get();
                    const { ...working } = this.working;

                    config.api = working;
                    config.api.origin = config.api.origin || "*";

                    this.$hoobs.config.update(config);

                    setTimeout(() => {
                        this.change(this.instance);
                    }, INSTANCE_RESTART_DELAY);
                } else if (this.identifier === "advanced") {
                    const instance = await this.$hoobs.instance(this.instance);
                    const plugins = await instance.plugins.list();

                    let { ...working } = this.working;

                    working.accessories = working.accessories || [];
                    working.platforms = working.platforms || [];

                    if (this.editor) {
                        try {
                            working = JSON.parse(this.editor.getValue());
                        } catch (_error) {
                            working = this.working;
                        }

                        for (let i = 0; i < working.platforms.length; i += 1) {
                            const { identifier } = ((plugins.find((plugin) => plugin.alias === working.platforms[i].platform)) || {});

                            if (identifier) working.platforms[i].plugin_map = { plugin_name: identifier };
                        }

                        for (let i = 0; i < working.accessories.length; i += 1) {
                            const { identifier } = ((plugins.find((plugin) => plugin.alias === working.accessories[i].accessory)) || {});

                            if (identifier) working.accessories[i].plugin_map = { plugin_name: identifier };
                        }
                    }

                    await instance.config.update(working);

                    setTimeout(() => {
                        this.change(this.instance);
                    }, INSTANCE_RESTART_DELAY);
                } else {
                    const instance = await this.$hoobs.instance(this.instance);
                    const config = await instance.config.get();
                    const { ...working } = this.working;

                    let index = -1;

                    switch (this.type) {
                        case "accessory":
                            index = config.accessories.findIndex((item) => item.accessory === this.alias);
                            working.accessories = working.accessories || [];

                            while (index >= 0) {
                                config.accessories.splice(index, 1);
                                index = config.accessories.findIndex((item) => item.accessory === this.alias);
                            }

                            for (let i = 0; i < working.accessories.length; i += 1) {
                                working.accessories[i].accessory = this.alias;
                                working.accessories[i].plugin_map = { plugin_name: this.identifier };
                            }

                            config.accessories = [...config.accessories, ...working.accessories];
                            break;

                        default:
                            index = config.platforms.findIndex((item) => item.platform === this.alias);

                            while (index >= 0) {
                                config.platforms.splice(index, 1);
                                index = config.platforms.findIndex((item) => item.platform === this.alias);
                            }

                            working.platform = this.alias;
                            working.plugin_map = { plugin_name: this.identifier };

                            config.platforms = [...config.platforms, working];
                            break;
                    }

                    await instance.config.update(config);

                    setTimeout(() => {
                        this.change(this.instance);
                    }, INSTANCE_RESTART_DELAY);
                }
            },

            async change(instance) {
                this.loading = true;
                this.instance = instance;

                if (this.editor) {
                    this.editor.dispose();
                    this.editor = null;
                }

                if (!this.identifier || this.identifier === "" || this.identifier === "api") {
                    this.working = (await this.$hoobs.config.get()).api || {};

                    this.working.inactive_logoff = this.working.inactive_logoff || 30;
                    this.working.disable_auth = this.working.disable_auth || false;
                    this.working.polling_seconds = this.working.polling_seconds || 5;
                    this.working.origin = this.working.origin === "*" ? "" : this.working.origin;

                    this.loading = false;
                } else if (this.identifier === "advanced") {
                    const theme = await this.$hoobs.theme.get(this.$store.state.theme);

                    let foreground = theme.widget.text.default.replace("#", "");
                    let background = "00000000";

                    if (foreground.length === 3) {
                        foreground = foreground.split("").map((item) => `${item}${item}`).join("");
                    }

                    if (background.length === 3) {
                        background = background.split("").map((item) => `${item}${item}`).join("");
                    }

                    this.working = await (await this.$hoobs.instance(instance)).config.get();
                    this.loading = false;

                    setTimeout(() => {
                        this.$refs.editor.innerHTML = "";

                        window.monaco.editor.defineTheme("theme", {
                            base: theme.mode === "dark" ? "vs-dark" : "vs",
                            inherit: true,
                            colors: {
                                "editor.foreground": `#${foreground}`,
                                "editor.background": `#${background}`,
                            },
                            rules: [
                                { token: "", foreground, background },
                            ],
                        });

                        this.editor = window.monaco.editor.create(this.$refs.editor, {
                            value: JSON.stringify(this.working, null, 4),
                            language: "json",
                            theme: "theme",
                            wordWrap: "on",
                            wrappingIndent: "indent",
                            renderLineHighlight: "none",
                            scrollBeyondLastLine: false,
                            contextmenu: false,
                            minimap: {
                                enabled: false,
                            },
                            scrollbar: {
                                useShadows: false,
                                horizontal: "hidden",
                                vertical: "hidden",
                            },
                            lineNumbers: false,
                        });
                    }, 10);
                } else {
                    const config = await (await this.$hoobs.instance(instance)).config.get();

                    const platforms = (config || {}).platforms || [];
                    const accessories = (config || {}).accessories || [];

                    switch (this.type) {
                        case "accessory":
                            this.working = { accessories: accessories.filter((item) => item.accessory === this.alias) || [] };
                            break;

                        default:
                            this.working = platforms.find((item) => item.platform === this.alias) || { platform: this.alias };
                            break;
                    }

                    this.loading = false;
                }
            },

            async switch(identifier) {
                this.loading = true;
                this.identifier = identifier;
                this.instances = await this.$hoobs.instances.list();
                this.schema = null;
                this.plugin = null;

                this.instances.sort((a, b) => {
                    if (a.id < b.id) return -1;
                    if (a.id > b.id) return 1;

                    return 0;
                });

                if (!this.identifier || this.identifier === "" || this.identifier === "api") {
                    this.change("");
                } else if (this.identifier === "advanced") {
                    if (this.instances.length > 0) {
                        this.change(((this.instances || [])[0] || {}).id || "");
                    } else {
                        this.loading = false;
                    }
                } else {
                    this.plugin = this.plugins.find((item) => item.identifier === identifier);

                    if (this.plugin && this.plugin.schema && this.plugin.schema.schema) {
                        this.type = this.plugin.schema.pluginType;
                        this.alias = this.plugin.alias || this.plugin.schema.pluginAlias;
                        this.instances = this.instances.filter((instance) => this.plugin.instances.findIndex((item) => item.id === instance.id) >= 0);

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

                    this.change(((this.instances || [])[0] || {}).id || "");
                }
            },

            async load(identifier) {
                this.loading = true;

                this.plugins = [{
                    identifier: "api",
                    display: this.$t("hub"),
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
                            plugin.display = this.$hoobs.repository.title(plugin.name);

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

            resize() {
                if (this.editor) {
                    this.editor.layout();
                }
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
                margin: 0 20px 20px 10px;
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

                    &.extra {
                        margin: 20px 0;
                    }
                }

                .wrapper {
                    max-width: 800px;
                }

                .tabs {
                    margin: 20px 0;

                    &.tight {
                        margin: 0 0 7px 0;
                    }
                }

                .editor {
                    flex: 1;
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
