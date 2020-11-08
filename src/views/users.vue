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
    <div v-if="user.permissions.users" id="users">
        <context />
        <div v-if="!loading" class="content">
            <div v-for="(user, index) in users" :key="index" v-on:click="edit(user.id)" class="card">
                <div class="icon">account_circle</div>
                <div class="details">
                    <div class="name">{{ user.name }}</div>
                    <div class="username">{{ user.username }}</div>
                </div>
            </div>
            <div v-on:click="add()" class="card add">
                <div class="icon">add</div>
            </div>
        </div>
        <user v-if="show.user" :id="id" :create="create" :close="cancel" />
    </div>
</template>

<script>
    import User from "@/components/dialogs/user.vue";

    export default {
        name: "users",

        components: {
            "user": User,
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                loading: true,
                users: [],
                id: null,
                create: false,
                show: {
                    user: false,
                },
            };
        },

        async mounted() {
            this.users = await this.$hoobs.users.list();
            this.loading = false;
        },

        methods: {
            edit(id) {
                this.id = id;
                this.create = false;
                this.show.user = true;
            },

            add() {
                this.id = null;
                this.create = true;
                this.show.user = true;
            },

            cancel() {
                this.show.user = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #users {
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

                    .username {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
