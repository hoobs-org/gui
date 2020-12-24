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
    <modal :title="$t('settings')" :draggable="true" width="760px" height="620px">
        <div id="settings">
            <div v-if="!loading" class="content">
                <div class="form">
                    <div class="row section">{{ $t("background") }}</div>
                    <div class="row">
                        <checkbox id="backdrop" v-model="backdrop">
                            <label for="backdrop">{{ $t("dashboard_background") }}</label>
                        </checkbox>
                    </div>
                    <div class="row section">{{ $t("dashboard_items") }}</div>
                    <div class="grid">
                        <div v-for="(item, index) in available" :key="`item:${index}`">
                            <checkbox :id="`item_${index}`" v-model="item.selected">
                                <label :for="`item_${index}`">{{ $t(item.label) }}</label>
                            </checkbox>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div class="actions modal">
                <div v-on:click="close()" class="button">{{ $t("cancel") }}</div>
                <div v-on:click="save()" class="button primary">{{ $t("apply") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    export default {
        name: "dashboard",

        props: {
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                loading: true,
                items: [],
                backdrop: "",
                available: [{
                    name: "activity",
                    label: "activity",
                    selected: false,
                }, {
                    name: "current",
                    label: "weather",
                    selected: false,
                }, {
                    name: "cpu",
                    label: "cpu",
                    selected: false,
                }, {
                    name: "forecast",
                    label: "weather_forecast",
                    selected: false,
                }, {
                    name: "memory",
                    label: "memory",
                    selected: false,
                }, {
                    name: "weather",
                    label: "weather_combined",
                    selected: false,
                }, {
                    name: "instances",
                    label: "instances",
                    selected: false,
                }, {
                    name: "log",
                    label: "log",
                    selected: false,
                }, {
                    name: "system",
                    label: "system_info",
                    selected: false,
                }],
            };
        },

        async mounted() {
            const { dashboard } = this.$store.state;

            this.items = dashboard.items;
            this.backdrop = dashboard.backdrop || false;

            for (let i = 0; i < this.items.length; i += 1) {
                const index = this.available.findIndex((item) => item.name === this.items[i].component);

                if (index >= 0) {
                    this.available[index].selected = true;
                }
            }

            this.loading = false;
        },

        methods: {
            save() {
                const current = JSON.parse(JSON.stringify(this.items));

                for (let i = 0; i < this.available.length; i += 1) {
                    const index = current.findIndex((item) => item.component === this.available[i].name);

                    if (this.available[i].selected && index === -1) {
                        const widget = this.defaults(this.available[i].name);

                        if (widget) {
                            current.unshift(widget);
                        }
                    } else if (!this.available[i].selected && index >= 0) {
                        current.splice(index, 1);
                    }
                }

                this.$store.commit("DASHBOARD:ITEMS", current);
                this.$store.commit("DASHBOARD:BACKDROP", this.backdrop);

                this.close();
            },

            defaults(item) {
                switch (item) {
                    case "activity":
                        return {
                            x: 0, y: 0, w: 12, h: 6, i: "1", component: "activity",
                        };

                    case "cpu":
                        return {
                            x: 0, y: 0, w: 1, h: 3, i: "7", component: "cpu",
                        };

                    case "memory":
                        return {
                            x: 0, y: 0, w: 1, h: 3, i: "8", component: "memory",
                        };

                    case "instances":
                        return {
                            x: 0, y: 0, w: 1, h: 3, i: "9", component: "instances",
                        };

                    case "log":
                        return {
                            x: 0, y: 0, w: 5, h: 7, i: "10", component: "log",
                        };

                    case "system":
                        return {
                            x: 0, y: 0, w: 4, h: 16, i: "4", component: "system",
                        };

                    case "weather":
                        return {
                            x: 0, y: 0, w: 5, h: 8, i: "2", component: "weather",
                        };

                    case "forecast":
                        return {
                            x: 0, y: 0, w: 4, h: 4, i: "5", component: "forecast",
                        };

                    case "current":
                        return {
                            x: 0, y: 0, w: 2, h: 5, i: "6", component: "current",
                        };

                    default:
                        return undefined;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #settings {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .grid {
            display: grid;
            grid-template-columns: auto auto;
        }
    }
</style>
