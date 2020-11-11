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
    <div v-if="user.permissions.instances" id="instances">
        <context />
        <div v-if="!loading" class="content">
            <div v-for="(instance, index) in instances" :key="index" v-on:click="edit(instance.id)" class="card">
                <div class="icon">layers</div>
                <div class="details">
                    <div class="name">{{ instance.display }}</div>
                    <div class="pin">{{ instance.pin }}</div>
                </div>
            </div>
            <div v-on:click="add()" class="card add">
                <div class="icon">add</div>
            </div>
        </div>
        <instance v-if="show.instance" :id="id" :create="create" :close="cancel" />
    </div>
</template>

<script>
    import Instance from "@/components/dialogs/instance.vue";

    export default {
        name: "instances",

        components: {
            "instance": Instance,
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                loading: true,
                instances: [],
                id: null,
                create: false,
                show: {
                    instance: false,
                },
            };
        },

        async mounted() {
            this.instances = await this.$hoobs.instances.list();
            this.loading = false;

            if (this.$route.query.id) {
                if (this.instances.findIndex((item) => item.id === decodeURIComponent(this.$route.query.id)) >= 0) {
                    this.edit(decodeURIComponent(this.$route.query.id));
                } else {
                    this.$router.push({ path: "/instances" });
                }
            }
        },

        methods: {
            edit(id) {
                this.id = id;
                this.create = false;
                this.show.instance = true;
            },

            add() {
                this.id = null;
                this.create = true;
                this.show.instance = true;
            },

            async cancel() {
                this.loading = true;

                if (this.$route.query.id) {
                    this.$router.push({ path: "/instances" });
                }

                this.instances = await this.$hoobs.instances.list();

                this.loading = false;
                this.show.instance = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #instances {
        .content {
            display: flex;
            flex-wrap: wrap;
            padding: 0 10px 10px 20px;

            .card {
                width: 220px;
                height: 87px;
                padding: 20px;
                margin: 0 10px 10px 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                align-content: center;
                align-items: center;
                background: var(--widget-background);
                border: 1px var(--application-border) solid;
                user-select: none;
                cursor: pointer;

                &:hover {
                    border: 1px var(--application-highlight) solid;
                }

                .icon {
                    font-size: 47px;
                    margin: 0 14px 0 0;
                }

                &.add {
                    justify-content: space-around;

                    .icon {
                        font-size: 42px;
                        color: var(--application-border);
                    }
                }

                .details {
                    flex: 1;

                    .name {
                        color: var(--application-highlight);
                        font-size: 17px;
                    }

                    .pin {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
