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
            <div v-if="!loading && stack" class="row">
                {{ $t("version") }}: {{ latest }}
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
                    href="https://github.com/hoobs-org/HOOBS/releases/latest"
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
                version: "",
                latest: "",
                plugins: [],
                stack: false,
                updated: false,
                updating: false,
            };
        },

        async mounted() {
            this.version = await this.$hoobs.version();
            this.latest = await this.$hoobs.latest();
            this.plugins = (await this.$hoobs.plugins()).filter((item) => !Semver.compare(item.version, item.latest, ">="));

            this.stack = !Semver.compare(this.version, this.latest, ">=");
            this.updated = !(this.stack || this.plugins.length > 0);

            this.loading = false;
        },

        methods: {
            async upgrade() {
                this.updating = true;

                const system = await this.$hoobs.system();

                await system.update();
                await system.reboot();
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
