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
    <div :key="version" v-if="user.permissions.accessories" id="accessories">
        <context>
            <router-link v-if="id !== 'add'" to="/accessories/add" class="button">
                <div class="mdi mdi-plus"></div>
                {{ $t("add_room") }}
            </router-link>
        </context>
        <div v-if="!loading" class="content">
            <list value="id" display="name" :values="rooms" :selected="id" :initial="rooms.length > 0 ? rooms[0].id : ''" controller="accessories" />
            <div v-if="!intermediate && id === 'add'" class="screen">
                <div class="wrapper">
                    <div class="row section">{{ $t("details") }}</div>
                    <div class="row">
                        <text-field :title="$t('name')" style="flex: 1; padding-right: 5px" v-model="display" />
                    </div>
                    <div class="row actions">
                        <div v-if="!loading" v-on:click="create()" class="button primary">{{ $t("save") }}</div>
                        <router-link to="/accessories" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </div>
            <div v-else-if="!intermediate && id === 'edit'" class="screen">
                <div class="wrapper">
                    <div class="row section">{{ $t("details") }}</div>
                    <div class="row">
                        <text-field :title="$t('name')" style="flex: 1; padding-right: 5px" v-model="display" />
                    </div>
                    <div class="row actions">
                        <div v-if="!loading" v-on:click="update()" class="button primary">{{ $t("save") }}</div>
                        <div v-if="!loading" v-on:click="remove()" class="button">{{ $t("remove") }}</div>
                        <router-link :to="`/accessories/${room}`" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </div>
            <div v-else-if="!intermediate" :class="!id ? 'screen desktop' : 'screen'">
                <div class="nav mobile">
                    <router-link to="/accessories" class="back"><span class="mdi mdi-chevron-left"></span> {{ $t("back") }}</router-link>
                </div>
                <div class="section">
                    <span>{{ display }}</span>
                    <router-link v-if="id !== 'default'" :to="`/accessories/edit/${id || rooms[0].id}`" class="mdi mdi-cog edit-room"></router-link>
                </div>
                <div v-if="hasFeatures()" class="features"></div>
                <div class="devices">
                    <div v-for="(accessory, index) in accessories" :key="`accessory:${index}`" class="device">
                        <component v-if="control(accessory)" :is="control(accessory)" :accessory="accessory" />
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
        </div>
        <div v-else class="loading">
            <spinner />
        </div>
    </div>
</template>

<script>
    import Sanitize from "@hoobs/sdk/lib/sanitize";
    import { Wait } from "@hoobs/sdk/lib/wait";

    import List from "@/components/elements/list.vue";

    import Validators from "../services/validators";
    import { accessories, types } from "../services/accessories";

    const SOCKET_RECONNECT_DELAY = 500;

    export default {
        name: "accessories",

        props: {
            id: String,
            room: String,
        },

        components: {
            "list": List,

            ...accessories(),
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                version: 0,
                loading: true,
                intermediate: true,
                characteristics: [],
                accessories: [],
                features: {
                    hue: false,
                    off: false,
                    leak: false,
                    light: false,
                    doors: false,
                    motion: false,
                    occupancy: false,
                    brightness: false,
                    temperature: false,
                },
                display: "",
                types: [],
                rooms: [],
            };
        },

        watch: {
            id() {
                this.load(this.id);
            },

            room() {
                this.load(this.id);
            },
        },

        created() {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === "IO:ROOM:CHANGE" && this.id !== "add" && this.id !== "edit") {
                    if (mutation.payload.data.action === "update") this.load(this.id);
                    if (mutation.payload.data.action === "add" || mutation.payload.data.action === "remove") this.rooms = await this.$hoobs.rooms.list();
                }
            });
        },

        mounted() {
            this.load(this.id);
        },

        methods: {
            control(accessory) {
                return types(accessory);
            },

            async load(id) {
                this.intermediate = true;
                this.accessories = [];
                this.display = "";
                this.rooms = await this.$hoobs.rooms.list();

                this.features.off = false;

                this.features.light = false;
                this.features.brightness = false;

                this.features.hue = false;

                this.features.temperature = false;
                this.features.occupancy = false;
                this.features.motion = false;
                this.features.leak = false;

                this.features.doors = false;

                for (let i = 0; i < this.rooms.length; i += 1) {
                    if (!this.rooms[i].name || this.rooms[i].name === "") this.rooms[i].name = this.$t(this.rooms[i].id);
                }

                if (id === "edit") {
                    const index = this.rooms.findIndex((item) => item.id === this.room);

                    if (index >= 0) {
                        const room = await this.$hoobs.room(this.rooms[index].id);

                        this.display = room.name || this.$t(room.id);
                    }
                } else if (id !== "add") {
                    let index = this.rooms.findIndex((item) => item.id === id);

                    if (index === -1 && this.rooms.length > 0) index = 0;

                    if (index >= 0) {
                        const room = await this.$hoobs.room(this.rooms[index].id);

                        this.characteristics = room.characteristics || [];
                        this.accessories = room.accessories || [];
                        this.display = room.name || this.$t(room.id);
                        this.types = room.types || [];

                        this.features.off = this.characteristics.indexOf("off") >= 0;

                        this.features.light = this.types.indexOf("lightbulb") && this.characteristics.indexOf("on") >= 0;
                        this.features.brightness = this.types.indexOf("lightbulb") && this.characteristics.indexOf("brightness") >= 0;

                        this.features.hue = this.characteristics.indexOf("hue") >= 0;

                        this.features.temperature = this.types.indexOf("temperature_sensor") >= 0;
                        this.features.occupancy = this.types.indexOf("occupancy_sensor") >= 0;
                        this.features.motion = this.types.indexOf("motion_sensor") >= 0;
                        this.features.leak = this.types.indexOf("leak_sensor") >= 0;

                        this.features.doors = this.types.indexOf("contact_sensor") >= 0 || this.types.indexOf("garage_door_opener") >= 0 || this.types.indexOf("door") >= 0;
                    }
                }

                this.loading = false;
                this.intermediate = false;
            },

            hasFeatures() {
                if (this.features.hue) return true;
                if (this.features.off) return true;
                if (this.features.leak) return true;
                if (this.features.light) return true;
                if (this.features.doors) return true;
                if (this.features.motion) return true;
                if (this.features.occupancy) return true;
                if (this.features.brightness) return true;
                if (this.features.temperature) return true;

                return false;
            },

            async remove() {
                this.$confirm(this.$t("remove"), this.$t("remove_remove_warning"), async () => {
                    this.intermediate = true;

                    const room = await this.$hoobs.room(this.room);

                    if (room.id === this.room) await room.remove();

                    this.$router.push({ path: "/accessories" });
                });
            },

            async update() {
                this.intermediate = true;

                const room = await this.$hoobs.room(this.room);

                if (room.id === this.room) await room.set("name", this.display);

                this.$router.push({ path: `/accessories/${this.room}` });
            },

            async create() {
                this.intermediate = true;

                const validation = Validators.room(true, this.display, this.rooms);

                if (validation.valid) {
                    await this.$hoobs.rooms.add(this.display);

                    setTimeout(async () => {
                        await Wait();

                        this.rooms = await this.$hoobs.rooms.list();
                        this.$router.push({ path: `/accessories/${this.rooms.find((item) => item.id === Sanitize(this.display)).id}` });
                    }, SOCKET_RECONNECT_DELAY);
                } else {
                    this.intermediate = false;
                    this.$alert(this.$t(validation.error));
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #accessories {
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

                .wrapper {
                    max-width: 800px;
                }

                .section {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 0 0 10px 0;
                    justify-content: space-between;
                    border-bottom: var(--application-border) 1px solid;
                    color: var(--application-highlight);
                    margin: 0 0 20px 0;
                    user-select: none;

                    .mdi {
                        color: var(--application-text) !important;
                        text-decoration: none !important;
                        font-size: 20px;
                        opacity: 0.5;
                        cursor: pointer;

                        &:hover {
                            opacity: 1;
                        }
                    }
                }

                .devices {
                    display: flex;
                    flex-wrap: wrap;

                    .device {
                        margin: 10px 10px 30px 30px;
                        width: 155px;

                        &:empty {
                            display: none;
                        }
                    }
                }

                .actions {
                    margin: 10px 0 0 0;
                }

                .nav {
                    display: flex;
                    flex-direction: row;
                    padding: 20px 0 10px 0;
                    border-bottom: var(--application-border) 1px solid;
                    margin: 0 0 20px 0;
                    user-select: none;

                    &:first-child {
                        padding: 0 0 10px 0;
                    }
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #accessories {
            .content {
                .screen {
                    max-width: unset;
                    background: transparent;
                    backdrop-filter: unset;
                    padding: 0 20px 10px 20px;
                    margin: 0;

                    .devices {
                        .device {
                            width: 50%;
                            margin: 0;
                            padding: 14px;
                            box-sizing: border-box;
                        }
                    }

                    .actions {
                        flex-direction: row;
                    }
                }
            }
        }
    }
</style>
