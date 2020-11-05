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
    <div id="widget">
        <div class="status">
            <div v-if="instances.filter((item) => item.running).length === instances.length" class="running">
                <div class="up all"></div>
                <div class="title">{{ $t("instances_up") }}</div>
            </div>
            <div v-else-if="instances.filter((item) => item.running).length > 0" class="running">
                <div class="up partial"></div>
                <div class="title">{{ instances.filter((item) => item.running).length }} {{ $t("of") }} {{ instances.length }} {{ $t("instances_partial") }}</div>
            </div>
            <div v-else class="running">
                <div class="up none"></div>
                <div class="title">{{ $t("instances_none") }}</div>
            </div>
        </div>
        <table v-if="!loading">
            <tbody>
                <tr>
                    <td>{{ $t("version") }}</td>
                    <td v-if="!updated">{{ version }} <a v-on:click.stop="update()" class="update">{{ $t("update_avaliable") }}</a></td>
                    <td v-else>{{ version }}</td>
                </tr>
                <tr>
                    <td>{{ $t("version_node") }}</td>
                    <td>{{ node }}</td>
                </tr>
                <tr>
                    <td>{{ $t("cpu") }}</td>
                    <td>{{ cpu.load || 0 }}%</td>
                </tr>
                <tr>
                    <td>{{ $t("memory") }}</td>
                    <td>{{ memory.load || 0 }}%</td>
                </tr>
                <tr v-for="(value, index) in Object.keys(system)" :key="index">
                    <td>{{ $t(value) }}</td>
                    <td>{{ system[value] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import Semver from "compare-versions";

    export default {
        name: "system",

        computed: {
            instances() {
                return this.$store.state.instances;
            },

            cpu() {
                return this.$store.state.cpu;
            },

            memory() {
                return this.$store.state.memory;
            },
        },

        data() {
            return {
                node: "",
                version: "",
                updated: "",
                loading: true,
                system: {},
            };
        },

        async mounted() {
            const status = await this.$hoobs.status();

            this.version = status.version;
            this.node = status.node_version;

            this.updated = Semver.compare(this.version, (await this.$hoobs.latest()), ">=");
            this.system = (await this.$hoobs.system()).system;

            this.loading = false;
        },

        methods: {
            update() {
                this.$store.commit("DIALOG:SHOW", "about");
            },
        },
    };
</script>

<style lang="scss" scoped>
    #widget {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 20px;
        cursor: default;

        .status {
            display: flex;
            flex-direction: row;
            padding: 10px 10px 20px 10px;
            user-select: none;

            .running {
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: 14px;
            }

            .up {
                width: 24px;
                height: 24px;
                border-radius: 100%;
                background: var(--widget-text);
                margin: 0 14px 0 0;

                &.all {
                    background: #07963d;
                }

                &.partial {
                    background: #feb400;
                }

                &.none {
                    background: #e30505;
                }
            }
        }

        .update {
            margin: 0 0 0 14px;
        }

        table {
            width: 100%;
            border-spacing: 0;

            tr {
                td {
                    width: 30%;
                    height: 26px;
                    min-height: 26px;
                    padding: 10px;
                    text-align: left;
                    font-size: 13px;
                    border-top: 1px var(--widget-border) solid;

                    &:first-child {
                        user-select: none;
                    }

                    &:last-child {
                        width: 70%;
                        word-break: break-all;
                    }
                }
            }
        }
    }
</style>
