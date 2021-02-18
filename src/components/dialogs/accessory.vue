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
    <modal :title="(accessory || {}).name || $t('accessory')" :draggable="true" width="760px" height="660px">
        <div id="accessory">
            <div v-if="!loading" class="content">
                <icons v-if="accessory && show.icons" :select="select" />
                <rooms v-else-if="accessory && show.rooms" :select="assign" />
                <div v-else-if="accessory" class="form">
                    <div class="row section">{{ $t("details") }}</div>
                    <div class="row">
                        <text-field :title="$t('name')" style="flex: 1; padding-right: 5px" v-model="display" />
                    </div>
                    <div class="row">
                        <checkbox id="hidden" :title="$t('hidden')" v-model="hidden" />
                    </div>
                    <div v-if="features.icon" class="row title">{{ $t("icon") }}</div>
                    <div v-if="features.icon" class="row">
                        <div class="icon">
                            <span :class="`mdi mdi-${icon.selected || icon.default}`"></span>
                        </div>
                        <div v-on:click="() => { show.icons = true; }" class="button">{{ $t("change") }}</div>
                    </div>
                    <div class="row section">{{ $t("room") }}</div>
                    <div v-if="features.icon" class="row">{{ $t("current_room") }}</div>
                    <div v-if="room" class="row current-room">
                        <span>{{ title }}</span>
                        <div v-on:click="() => { show.rooms = true; }" class="button">{{ $t("room_assign") }}</div>
                        <div v-if="room !== 'default'" v-on:click="assign()" class="button">{{ $t("remove") }}</div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div v-if="!loading && show.icons" class="actions modal">
                <div class="button" v-on:click="select(null)">{{ $t("default") }}</div>
                <div class="button" v-on:click="() => { show.icons = false; }">{{ $t("cancel") }}</div>
            </div>
            <div v-else-if="!loading && show.rooms" class="actions modal">
                <div class="button" v-on:click="() => { show.rooms = false; }">{{ $t("cancel") }}</div>
            </div>
            <div v-else class="actions modal">
                <div v-on:click="$dialog.close('accessory')" class="button">{{ $t("cancel") }}</div>
                <div v-on:click="save()" class="button primary">{{ $t("apply") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    import { Wait } from "@hoobs/sdk/lib/wait";

    import Icons from "@/components/dialogs/icons.vue";
    import Rooms from "@/components/dialogs/rooms.vue";

    export default {
        name: "settings",

        components: {
            "icons": Icons,
            "rooms": Rooms,
        },

        props: {
            options: Object,
        },

        data() {
            return {
                loading: true,
                accessory: null,
                dashboard: [],
                display: "",
                hidden: false,
                room: "",
                title: "",
                icon: {
                    selected: null,
                    default: null,
                },
                safety: 0,
                features: {
                    icon: false,
                },
                show: {
                    icons: false,
                    rooms: false,
                },
            };
        },

        async mounted() {
            await this.load();
        },

        watch: {
            async room() {
                const rooms = await this.$hoobs.rooms.list();
                const room = rooms.find((item) => item.id === this.room) || {};

                this.title = room.name || this.$t(room.id || "default");
            },
        },

        methods: {
            async load() {
                this.loading = true;
                this.accessory = null;

                await Wait();

                const accessory = await this.$hoobs.accessory(this.options.bridge, this.options.id);

                this.accessory = accessory;
                this.items = this.$store.state.dashboard.items;
                this.display = this.accessory.name;
                this.hidden = this.accessory.hidden;
                this.room = this.accessory.room;
                this.loading = false;

                switch (this.accessory.type) {
                    case "light":
                        this.features.icon = true;
                        this.icon.default = "lightbulb-outline";
                        this.icon.selected = this.accessory.icon;
                        break;

                    case "sensor":
                        this.features.icon = true;
                        this.icon.default = "memory";
                        this.icon.selected = this.accessory.icon;
                        break;

                    case "switch":
                    case "outlet":
                        this.features.icon = true;
                        this.icon.default = "toggle-switch-off";
                        this.icon.selected = this.accessory.icon;
                        break;

                    case "fan":
                        this.features.icon = true;
                        this.icon.default = "fan";
                        this.icon.selected = this.accessory.icon;
                        break;

                    default:
                        this.features.icon = false;
                        this.icon.default = null;
                        this.icon.selected = this.accessory.icon;
                        break;
                }
            },

            select(icon) {
                if (icon === this.icon.default) {
                    this.icon.selected = null;
                } else {
                    this.icon.selected = icon;
                }

                this.show.icons = false;
            },

            assign(room) {
                this.room = room && room !== "" && room !== "default" ? room : "default";
                this.show.rooms = false;
            },

            async save() {
                await Wait();

                const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);

                if (this.display !== this.accessory.name) await accessory.set("name", this.display);
                if (this.room !== this.accessory.room) await accessory.set("room", this.room);
                if (this.features.icon) await accessory.set("icon", this.icon.selected);

                await accessory.set("hidden", this.hidden);

                this.$dialog.close("accessory");
            },
        },
    };
</script>

<style lang="scss" scoped>
    #accessory {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;
        overflow: hidden;

        .content {
            overflow: hidden;

            .form {
                overflow: auto;
                -ms-overflow-style: none;
                scrollbar-width: none;

                &::-webkit-scrollbar {
                    display: none;
                }

                .title {
                    margin: 14px 0 0 0;
                }

                .current-room {
                    margin: 10px 0;
                    align-items: center;

                    span {
                        margin: 0 14px 0 0;
                        color: var(--application-highlight);
                        font-size: 27px;
                    }
                }

                .icon {
                    margin: 0 14px 14px 0;
                    border: 1px var(--application-border) solid;
                    padding: 7px;

                    .mdi {
                        font-size: 42px;
                    }
                }
            }
        }
    }
</style>
