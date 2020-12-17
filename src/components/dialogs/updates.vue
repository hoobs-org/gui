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
    <div id="updates" class="content">
        <div v-if="!updating" class="form">
            <div class="row section">{{ $t("software") }}</div>
            <div v-if="!loading && !status.upgraded" class="row">
                {{ $t("version_server") }}: {{ status.release }}
                <span class="value">{{ $t("available") }}</span>
            </div>
            <div v-if="!loading && !status.cli_upgraded" class="row">
                {{ $t("version_cli") }}: {{ status.cli_release }}
                <span class="value">{{ $t("available") }}</span>
            </div>
            <div v-if="!loading && !status.node_upgraded" class="row">
                {{ $t("version_node") }}: {{ status.node_release }}
                <span class="value">{{ $t("available") }}</span>
            </div>
            <div v-if="!loading && plugins.length > 0" class="row">
                {{ $t("plugins") }}: {{ plugins.length }} {{ $t("plugin_updates") }}
                <span
                    class="value"
                >{{ $t("available") }}</span>
            </div>
            <div v-if="!loading && !updated" class="row" style="margin-top: 7px;">
                <a
                    v-if="stack"
                    class="button"
                    href="https://github.com/hoobs-org/hoobsd/releases/latest"
                    target="_blank"
                >{{ $t("changelog") }}</a>
                <div v-if="stack" v-on:click="upgrade()" class="button">{{ $t("update_now") }}</div>
                <div
                    v-if="plugins.length > 0"
                    v-on:click="update()"
                    class="button"
                >{{ $t("update_plugins") }}</div>
            </div>
            <div v-if="!loading && updated" class="row updated">
                <span class="icon">update</span>
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
            this.status = await this.$hoobs.status();
            this.version = await this.$hoobs.version();
            this.plugins = (await this.$hoobs.plugins()).filter((item) => !Semver.compare(item.version, item.latest, ">="));

            this.stack = !(this.status.upgraded && this.status.cli_upgraded && this.status.node_upgraded);
            this.updated = !(this.stack || this.plugins.length > 0);

            this.loading = false;
        },

        methods: {
            async upgrade() {
                this.updating = true;

                const system = await this.$hoobs.system();

                await system.update();
            },

            async update() {
                for (let i = 0; i < this.plugins.length; i += 1) {
                    const { ...plugin } = this.plugins[i];
                    const instance = await this.$hoobs.instance(plugin.instance);

                    await instance.plugin.upgrade(plugin.identifier);
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #updates {
        .value {
            font-weight: bold;
            margin: 0 4px;
        }

        .loading {
            margin: 7px 0 0 0;
        }

        .updated {
            align-items: center;

            .icon {
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
