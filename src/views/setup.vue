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
    <div v-if="step >= 0" id="setup">
        <modal v-if="step === 0" width="760px" height="670px">
            <welcome :message="$t('welcome')" />
            <div class="loading">
                <spinner v-model="message" />
            </div>
        </modal>
        <modal v-else-if="step === 1" width="760px" height="670px">
            <welcome :message="$t('welcome')" />
            <p>{{ $t("user_add_admin_account") }}</p>
            <form
                class="modal"
                autocomplete="false"
                method="post"
                action="/setup"
                v-on:submit.prevent="account()"
            >
                <div v-if="errors.length > 0" class="errors">
                    <span v-for="(error, index) in errors" :key="index">{{ error }}</span>
                </div>
                <input type="submit" class="hidden-submit" value="submit" />
                <text-field
                    :name="$t('name')"
                    :description="$t('name_description')"
                    v-model="name"
                    :required="true"
                />
                <text-field
                    :name="$t('username')"
                    :description="$t('username_description')"
                    v-model="username"
                    :required="true"
                />
                <password-field
                    :name="$t('password')"
                    :description="$t('password_description')"
                    v-model="password"
                />
                <password-field
                    :name="$t('password_confirm')"
                    :description="$t('password_confirm_description')"
                    v-model="challenge"
                />
            </form>
            <div class="actions modal">
                <div class="copyright">
                    HOOBS and the HOOBS logo are registered trademarks of HOOBS, Inc.
                    <br />Copyright &copy; {{ (new Date()).getFullYear() }} HOOBS, Inc. All rights reserved.
                </div>
                <div class="button light" v-on:click="disable()">{{ $t("disable_login") }}</div>
                <div class="button primary" v-on:click="account()">{{ $t("create_account") }}</div>
            </div>
        </modal>
        <modal v-else-if="step === 2" width="760px" height="670px">
            <welcome :message="$t('welcome')" />
            <p>{{ $t("instance_create_default") }}</p>
            <form
                class="modal"
                autocomplete="false"
                method="post"
                action="/setup"
                v-on:submit.prevent="setup()"
            >
                <div v-if="errors.length > 0" class="errors">
                    <span v-for="(error, index) in errors" :key="index">{{ error }}</span>
                </div>
                <input type="submit" class="hidden-submit" value="submit" />
                <text-field
                    :name="$t('instance_name')"
                    :description="$t('instance_name_description')"
                    v-model="instance"
                    :required="true"
                />
                <port-field
                    :name="$t('instance_port')"
                    :description="$t('instance_port_description')"
                    v-model="port"
                    :required="true"
                />
            </form>
            <div class="actions modal">
                <div class="copyright">
                    HOOBS and the HOOBS logo are registered trademarks of HOOBS, Inc.
                    <br />Copyright &copy; {{ (new Date()).getFullYear() }} HOOBS, Inc. All rights reserved.
                </div>
                <div class="button primary" v-on:click="setup()">{{ $t("create_instance") }}</div>
            </div>
        </modal>
    </div>
</template>

<script>
    import Welcome from "../components/elements/welcome.vue";
    import { sleep } from "../services/sdk";

    export default {
        name: "setup",

        components: {
            "welcome": Welcome,
        },

        data() {
            return {
                step: -1,
                name: "",
                username: "",
                password: "",
                challenge: "",
                instance: "Default",
                port: 51826,
                errors: [],
                message: "",
            };
        },

        async mounted() {
            this.step = await this.progress();
        },

        methods: {
            async wait(callback, compare, saftey) {
                const results = await callback();

                if (compare(results)) return results;
                if ((saftey || 0) >= 300) return results;

                await sleep(1000);

                return this.wait(callback, compare, (saftey || 0) + 1);
            },

            async progress() {
                if (this.step > 0) this.step = 0;

                const status = await this.hoobs.auth.status();
                const instances = await this.hoobs.instances.count();

                this.message = "";

                if (status === "uninitialized") return 1;
                if (instances === 0 && !(await this.hoobs.auth.validate())) this.$router.push({ path: "/login", query: { url: "/setup" } });
                if (instances === 0) return 2;

                this.$router.push({ path: "/" });

                return -1;
            },

            async account() {
                this.errors = [];

                if (this.username.length < 3) this.errors.push(this.$t("username_required"));
                if (this.password.length < 5) this.errors.push(this.$t("password_weak"));
                if (this.password !== this.challenge) this.errors.push(this.$t("password_mismatch"));

                if (this.errors.length === 0) {
                    this.step = 0;
                    this.message = `${this.$t("user_add_creating")} ...`;

                    await this.hoobs.users.add(this.username.toLowerCase(), this.password, this.name, true);

                    if (await this.hoobs.auth.login(this.username.toLowerCase(), this.password)) {
                        this.$router.push({ path: this.url });
                    } else {
                        this.errors.push(this.$t("user_add_failed"));
                    }

                    this.step = await this.progress();
                }
            },

            async setup() {
                this.errors = [];

                if (this.instance.length < 3) this.errors.push(this.$t("instance_name_required"));
                if (Number.isNaN(parseInt(this.port, 10)) || parseInt(this.port, 10) < 1 || parseInt(this.port, 10) > 65535) this.errors.push(this.$t("instance_port_required"));

                const instances = await this.hoobs.instances.list();

                if (instances.findIndex((item) => item.port === parseInt(this.port, 10)) >= 0) this.errors.push(this.$t("instance_port_taken"));

                if (this.errors.length === 0) {
                    this.step = 0;
                    this.message = `${this.$t("instance_create")} ...`;

                    await this.hoobs.instances.add(this.instance, parseInt(this.port, 10));
                    await this.wait(this.hoobs.instances.count, (value) => value > 0);

                    this.step = await this.progress();
                }
            },

            async disable() {
                this.step = 0;
                this.message = `${this.$t("disable_login_disabling")} ...`;

                await this.hoobs.auth.disable();
                await this.wait(this.hoobs.auth.status, (value) => value === "disabled");

                this.step = await this.progress();
            },
        },
    };
</script>

<style lang="scss" scoped>
    #setup {
        .loading {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 10px 20% 10px;
        }

        .errors {
            margin: 0 0 20px 0;
            padding: 0 0 20px 0;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: var(--modal-error-text);
            border-bottom: var(--modal-border) 1px solid;
        }

        p {
            padding: 0 10px;
        }

        form {
            flex: 1;
            border: var(--modal-border) 1px solid;
            background: var(--modal-background);
            padding: 20px;
            margin: 0 10px;
            border-radius: 4px;
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #setup {
            padding: 0;
            background: unset;
            align-items: unset;

            .errors {
                border-bottom: 0 none;
            }

            form {
                border: unset;
                padding: unset;
                border-radius: unset;
            }
        }
    }
</style>
