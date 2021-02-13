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
    <modal :title="$t('updates')" :draggable="true" width="720px" height="520px">
        <div id="updates">
            <div class="content">
                <div v-if="!updating" class="form">
                    <div class="row section">{{ $t("software") }}</div>
                    <div v-if="!loading && !status.upgraded" class="row">
                        {{ $t("version_server") }}: {{ status.current }}
                        <span class="value">{{ $t("available") }}</span>
                    </div>
                    <div v-if="!loading && !status.cli_upgraded" class="row">
                        {{ $t("version_cli") }}: {{ status.cli_current }}
                        <span class="value">{{ $t("available") }}</span>
                    </div>
                    <div v-if="!loading && !status.node_upgraded" class="row">
                        {{ $t("version_node") }}: {{ status.node_current }}
                        <span class="value">{{ $t("available") }}</span>
                    </div>
                    <div v-if="!loading && plugins.length > 0" class="row">
                        {{ $t("plugins") }}: {{ plugins.length }} {{ $t("plugin_updates") }}
                        <span class="value">{{ $t("available") }}</span>
                    </div>
                    <div v-if="!loading && !updated" class="row" style="margin-top: 7px;">
                        <a v-if="stack" class="button" href="https://github.com/hoobs-org/HOOBS" target="_blank">{{ $t("changelog") }}</a>
                        <div v-if="stack" v-on:click="upgrade()" class="button">{{ $t("update_now") }}</div>
                        <div v-if="plugins.length > 0" v-on:click="update()" class="button">{{ $t("update_plugins") }}</div>
                    </div>
                    <div v-if="!loading && updated" class="row updated">
                        <span class="mdi mdi-update"></span>
                        <div class="text">{{ $t("updated") }}</div>
                    </div>
                    <div v-if="loading" class="row loading">
                        <spinner />
                    </div>
                </div>
                <div v-else class="loading">
                    <spinner />
                </div>
            </div>
            <div class="actions modal">
                <div v-on:click="$dialog.close('updates')" class="button">{{ $t("cancel") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    import Semver from "compare-versions";

    export default {
        name: "updates",

        data() {
            return {
                loading: true,
                status: {},
                version: "",
                plugins: [],
                stack: false,
                updated: false,
                updating: false,
            };
        },

        async mounted() {
            this.load();
        },

        methods: {
            async load() {
                this.loading = true;

                this.status = await this.$hoobs.status();
                this.version = await this.$hoobs.version();

                this.plugins = ((await this.$hoobs.plugins()) || []).filter((item) => !Semver.compare(item.version, item.latest, ">="));

                this.stack = !(this.status.upgraded && this.status.cli_upgraded && this.status.node_upgraded);
                this.updated = !(this.stack || this.plugins.length > 0);

                this.loading = false;
                this.updating = false;
            },

            async upgrade() {
                this.updating = true;

                this.$hoobs.system().then((system) => {
                    system.update().then(() => {
                        this.load();
                    });
                });
            },

            update() {
                this.updating = true;

                const waits = [];

                for (let i = 0; i < this.plugins.length; i += 1) {
                    const { ...plugin } = this.plugins[i];

                    waits.push(new Promise((resolve) => {
                        this.$hoobs.bridge(plugin.bridge).then((bridge) => {
                            bridge.plugins.upgrade(plugin.identifier).then(() => {
                                resolve();
                            });
                        });
                    }));
                }

                Promise.all(waits).then(() => {
                    this.load();
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    #updates {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .value {
            font-weight: bold;
            margin: 0 4px;
        }

        .loading {
            margin: 7px 0 0 0;
        }

        .updated {
            align-items: center;

            .mdi {
                color: var(--modal-highlight);
                font-size: 37px;
            }

            .text {
                font-size: 22px;
                margin: 0 0 0 14px;
            }
        }
    }
</style>
