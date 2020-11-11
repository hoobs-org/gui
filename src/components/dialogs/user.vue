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
    <modal v-if="title" :title="$t(title)" :draggable="true" width="760px" :height="`${height}px`">
        <div id="user">
            <div v-if="!loading" class="content">
                <div class="form">
                    <div class="row section">{{ $t("profile") }}</div>
                    <div class="row">
                        <text-field
                            :name="$t('name')"
                            style="flex: 1; padding-right: 5px;"
                            v-model="name"
                        />
                        <text-field
                            :name="$t('username')"
                            style="flex: 1; padding-right: 0; padding-left: 5px;"
                            v-model="username"
                        />
                    </div>
                    <div class="row section">{{ $t("security") }}</div>
                    <div class="row">
                        <password-field
                            :name="$t('password')"
                            style="flex: 1; padding-right: 5px;"
                            v-model="password"
                        />
                        <password-field
                            :name="$t('password_confirm')"
                            style="flex: 1; padding-right: 0; padding-left: 5px;"
                            v-model="challenge"
                        />
                    </div>
                    <div v-if="subject.id > 1 || create" class="row section">{{ $t("permissions") }}</div>
                    <div v-if="subject.id > 1 || create" class="grid">
                        <div v-for="(permission, index) in permissions" :key="index">
                            <checkbox :id="`permission_${index}`" v-model="permission.selected">
                                <label :for="`permission_${index}`">{{ $t(permission.label) }}</label>
                            </checkbox>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div class="actions modal">
                <div v-if="subject.id > 1 && !create" v-on:click="remove()" class="button">{{ $t("remove") }}</div>
                <div class="fill"></div>
                <div v-on:click="close()" class="button">{{ $t("cancel") }}</div>
                <div v-if="!loading" v-on:click="save()" class="button primary">{{ $t("apply") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    export default {
        name: "user",

        props: {
            id: Number,
            create: Boolean,
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                loading: true,
                height: 620,
                title: null,
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

        async mounted() {
            this.title = "user_add";

            if (!this.create) {
                this.title = "user_edit";
                this.subject = await this.$hoobs.user(this.id);
                this.name = this.subject.name;
                this.username = this.subject.username;

                if (this.subject.id <= 1) {
                    this.height = 420;
                }

                for (let i = 0; i < this.permissions.length; i += 1) {
                    this.permissions[i].selected = this.subject.permissions[this.permissions[i].name];
                }
            }

            this.loading = false;
        },

        methods: {
            async save() {
                let valid = true;

                if (this.create) {
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
                        this.close();
                    }
                }
            },

            async remove() {
                if (this.subject.id > 1) {
                    this.$confirm(this.$t("remove"), this.$t("remove_user_warning"), async () => {
                        await this.subject.remove();

                        this.close();
                    });
                } else {
                    this.close();
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #user {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .grid {
            display: grid;
            grid-template-columns: auto auto;
        }

        .fill {
            flex: 1;
        }
    }
</style>
