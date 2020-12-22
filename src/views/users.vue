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
        <context>
            <router-link v-if="id !== 'add'" to="/users/add" class="button">
                <div class="icon">add</div>
                {{ $t("add") }}
            </router-link>
        </context>
        <div v-if="!loading" class="content">
            <list value="id" display="name" :values="users" :selected="id" controller="users" />
            <form v-if="parseInt(id, 10) > 0" class="screen form">
                <div class="wrapper">
                    <div class="row section">{{ $t("profile") }}</div>
                    <div class="row">
                        <text-field :name="$t('name')" v-model="name" />
                        <text-field :name="$t('username')" v-model="username" />
                    </div>
                    <div class="row section">{{ $t("security") }}</div>
                    <div class="row">
                        <password-field :name="$t('password')" v-model="password" />
                        <password-field :name="$t('password_confirm')" v-model="challenge" />
                    </div>
                    <div v-if="subject.id > 1" class="row section">{{ $t("permissions") }}</div>
                    <div v-if="subject.id > 1" class="grid">
                        <div v-for="(permission, index) in permissions" :key="index">
                            <checkbox :id="`permission_${index}`" v-model="permission.selected">
                                <label :for="`permission_${index}`">{{ $t(permission.label) }}</label>
                            </checkbox>
                        </div>
                    </div>
                    <div class="row actions">
                        <div v-if="!loading" v-on:click="save()" class="button primary">{{ $t("save") }}</div>
                        <div v-if="subject.id > 1" v-on:click="remove()" class="button">{{ $t("remove") }}</div>
                        <router-link to="/users" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </form>
            <form v-else-if="id === 'add'" class="screen form">
                <div class="wrapper">
                    <div class="row section">{{ $t("profile") }}</div>
                    <div class="row">
                        <text-field :name="$t('name')" v-model="name" />
                        <text-field :name="$t('username')" v-model="username" />
                    </div>
                    <div class="row section">{{ $t("security") }}</div>
                    <div class="row">
                        <password-field :name="$t('password')" v-model="password" />
                        <password-field :name="$t('password_confirm')" v-model="challenge" />
                    </div>
                    <div class="row section">{{ $t("permissions") }}</div>
                    <div class="grid">
                        <div v-for="(permission, index) in permissions" :key="index">
                            <checkbox :id="`permission_${index}`" v-model="permission.selected">
                                <label :for="`permission_${index}`">{{ $t(permission.label) }}</label>
                            </checkbox>
                        </div>
                    </div>
                    <div class="row actions">
                        <div v-if="!loading" v-on:click="save(true)" class="button primary">{{ $t("save") }}</div>
                        <router-link to="/users" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </form>
            <div v-else class="initial desktop">
                <div class="message">
                    {{ $t("user_select_add") }}
                    <router-link to="/users/add">{{ $t("user_add") }}</router-link>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <spinner />
        </div>
    </div>
</template>

<script>
    import List from "../components/elements/list.vue";

    export default {
        name: "users",

        props: {
            id: String,
        },

        components: {
            "list": List,
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
                subject: {},
                name: "",
                username: "",
                password: "",
                challenge: "",
                permissions: [{
                    name: "accessories",
                    label: "permission_accessories",
                    selected: false,
                }, {
                    name: "controller",
                    label: "permission_controller",
                    selected: false,
                }, {
                    name: "instances",
                    label: "permission_instances",
                    selected: false,
                }, {
                    name: "terminal",
                    label: "permission_terminal",
                    selected: false,
                }, {
                    name: "plugins",
                    label: "permission_plugins",
                    selected: false,
                }, {
                    name: "users",
                    label: "permission_users",
                    selected: false,
                }, {
                    name: "reboot",
                    label: "permission_reboot",
                    selected: false,
                }, {
                    name: "config",
                    label: "permission_config",
                    selected: false,
                }],
            };
        },

        watch: {
            id(value) {
                this.load(value);
            },
        },

        async mounted() {
            this.load(this.id);
        },

        methods: {
            async load(id) {
                this.loading = true;
                this.users = await this.$hoobs.users.list();
                this.subject = {};
                this.name = "";
                this.username = "";

                for (let i = 0; i < this.permissions.length; i += 1) {
                    this.permissions[i].selected = false;
                }

                if (parseInt(id, 10) > 0) {
                    this.subject = await this.$hoobs.user(parseInt(id, 10));
                    this.name = this.subject.name;
                    this.username = this.subject.username;

                    for (let i = 0; i < this.permissions.length; i += 1) {
                        this.permissions[i].selected = this.subject.permissions[this.permissions[i].name];
                    }
                }

                this.loading = false;
            },

            async save(create) {
                let valid = true;

                if (create) {
                    if (valid && this.username.length < 3) {
                        this.$alert(this.$t("username_required"));
                        valid = false;
                    }

                    if (valid && this.password.length < 5) {
                        this.$alert(this.$t("password_weak"));
                        valid = false;
                    }

                    if (valid && this.password !== this.challenge) {
                        this.$alert(this.$t("password_mismatch"));
                        valid = false;
                    }

                    if (valid) {
                        this.loading = true;

                        const permissions = {
                            accessories: false,
                            controller: false,
                            instances: false,
                            terminal: false,
                            plugins: false,
                            users: false,
                            reboot: false,
                            config: false,
                        };

                        for (let i = 0; i < this.permissions.length; i += 1) {
                            permissions[this.permissions[i].name] = this.permissions[i].selected;
                        }

                        await this.$hoobs.users.add(this.username, this.password, !this.name || this.name === "" ? this.username : this.name, permissions);
                    }
                } else if (this.subject.id === 1) {
                    if (valid && this.username.length < 3) {
                        this.$alert(this.$t("username_required"));
                        valid = false;
                    }

                    if (valid && this.password && this.password !== "" && this.password.length < 5) {
                        this.$alert(this.$t("password_weak"));
                        valid = false;
                    }

                    if (valid && this.password && this.password !== "" && this.password !== this.challenge) {
                        this.$alert(this.$t("password_mismatch"));
                        valid = false;
                    }

                    if (valid) {
                        this.loading = true;

                        await this.subject.update(this.username, !this.password || this.password === "" ? null : this.password, !this.name || this.name === "" ? this.username : this.name);
                    }
                } else {
                    if (valid && this.username.length < 3) {
                        this.$alert(this.$t("username_required"));
                        valid = false;
                    }

                    if (valid && this.password && this.password !== "" && this.password.length < 5) {
                        this.$alert(this.$t("password_weak"));
                        valid = false;
                    }

                    if (valid && this.password && this.password !== "" && this.password !== this.challenge) {
                        this.$alert(this.$t("password_mismatch"));
                        valid = false;
                    }

                    if (valid) {
                        this.loading = true;

                        const permissions = {
                            accessories: false,
                            controller: false,
                            instances: false,
                            terminal: false,
                            plugins: false,
                            users: false,
                            reboot: false,
                            config: false,
                        };

                        for (let i = 0; i < this.permissions.length; i += 1) {
                            permissions[this.permissions[i].name] = this.permissions[i].selected;
                        }

                        await this.subject.update(this.username, !this.password || this.password === "" ? null : this.password, !this.name || this.name === "" ? this.username : this.name, permissions);
                    }
                }

                if (valid) {
                    if (this.user.id === this.subject.id) {
                        await this.$hoobs.auth.logout();

                        this.$router.push({ path: "/login", query: { url: "/users" } });
                    } else {
                        this.users = await this.$hoobs.users.list();
                        this.$router.push({ path: `/users/${this.users.find((item) => item.username === this.username).id}` });
                    }
                }
            },

            async remove() {
                if (this.subject.id > 1) {
                    this.$confirm(this.$t("remove"), this.$t("remove_user_warning"), async () => {
                        await this.subject.remove();

                        this.users = await this.$hoobs.users.list();
                        this.$router.push({ path: "/users" });
                    });
                } else {
                    this.$router.push({ path: "/users" });
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #users {
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
                margin: 0 20px 20px 20px;
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

                .field {
                    flex: 1;
                    padding-right: 0;
                    padding-left: 5px;

                    &:first-child {
                        padding-right: 5px;
                    }
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
        #users {
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

                    .grid {
                        display: flex;
                        flex-direction: column;
                    }

                    .actions {
                        flex-direction: row;
                    }

                    .field {
                        padding-right: 0;
                        padding-left: 0;

                        &:first-child {
                            padding-right: 0;
                        }
                    }
                }
            }
        }
    }
</style>
