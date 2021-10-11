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
    <div :key="version" id="setup">
        <modal v-if="loading" :welcome="$t('welcome')" width="760px" height="670px">
            <div class="loading">
                <spinner v-model="message" />
            </div>
        </modal>
        <modal v-else-if="platform && desktop" :welcome="$t('welcome')" width="760px" height="670px">
            <div class="form downloads modal">
                <div>
                    <div class="message">{{ $t("download_hoobs_desktop") }}</div>
                    <div v-if="platform === 'win'" v-on:click="download()" class="button download">
                        <svg width="30" height="30" viewBox="0 0 50 50">
                            <path d="M1.589 23.55L1.572 8.24l18.839-2.558V23.55zM23.55 5.225l25.112-3.654V23.55H23.55zM48.669 26.69l-.006
                                     21.979-25.112-3.533V26.69zM20.41 44.736l-18.824-2.58-.001-15.466H20.41z" />
                        </svg>
                        {{ $t("download_win") }}
                    </div>
                    <div v-if="platform === 'mac'" v-on:click="download()" class="button download">
                        <svg width="30" height="30" viewBox="0 0 50 50">
                            <path d="M39.054 34.065q-1.093 3.504-3.448 7.009-3.617 5.495-7.205 5.495-1.374 0-3.925-.897-2.411-.897-4.233-.897-1.71
                                     0-3.981.925-2.271.953-3.701.953-4.261 0-8.439-7.261Q.001 32.075.001 25.29q0-6.392 3.168-10.485 3.14-4.037
                                     7.962-4.037 2.019 0 4.962.841 2.916.841 3.869.841 1.262 0 4.009-.953 2.86-.953 4.85-.953 3.336 0 5.972 1.822
                                     1.458 1.009 2.916 2.804-2.215 1.878-3.196 3.308-1.822 2.635-1.822 5.803 0 3.476 1.934 6.252t4.43 3.533zM28.512
                                     1.179q0 1.71-.813 3.813-.841 2.103-2.607 3.869-1.514 1.514-3.028 2.019-1.037.308-2.916.477.084-4.177
                                     2.187-7.205 2.075-3 7.009-4.149.028.084.07.308t.07.308q0 .112.014.28t.014.28z" />
                        </svg>
                        {{ $t("download_mac") }}
                    </div>
                </div>
            </div>
            <div class="actions modal">
                <div class="copyright">
                    Copyright &copy; {{ (new Date()).getFullYear() }} HOOBS, Inc. All rights reserved.
                </div>
                <div class="button" v-on:click="desktop = false;">{{ $t("browser_continue") }}</div>
            </div>
        </modal>
        <modal v-else :welcome="$t('welcome')" width="760px" height="670px">
            <p>{{ $t("user_add_admin_account") }}</p>
            <form class="form modal" autocomplete="false" method="post" action="/setup" v-on:submit.prevent="account()">
                <div v-if="errors.length > 0" class="errors">
                    <span v-for="(error, index) in errors" :key="`errors:${index}`">{{ error }}</span>
                </div>
                <input type="submit" class="hidden-submit" value="submit" />
                <text-field :title="$t('name')" :description="$t('name_description')" v-model="name" :required="true" :autofocus="true" />
                <text-field :title="$t('username')" :description="$t('username_description')" v-model="username" :required="true" />
                <password-field :title="$t('password')" :description="$t('password_description')" v-model="password" />
                <password-field :title="$t('password_confirm')" :description="$t('password_confirm_description')" v-model="challenge" />
            </form>
            <div class="actions modal">
                <div class="copyright">
                    Copyright &copy; {{ (new Date()).getFullYear() }} HOOBS, Inc. All rights reserved.
                </div>
                <div class="button" v-on:click="disable()">{{ $t("disable_login") }}</div>
                <div class="button primary" v-on:click="account()">{{ $t("create_account") }}</div>
            </div>
        </modal>
    </div>
</template>

<script>
    import { Sleep } from "@hoobs/sdk/lib/wait";

    export default {
        name: "setup",

        computed: {
            platform() {
                const platform = (navigator.platform || "").toLowerCase();

                if (platform.startsWith("win")) return "win";
                if (platform.startsWith("mac")) return "mac";

                return undefined;
            },
        },

        data() {
            return {
                version: 0,
                loading: true,
                desktop: true,
                name: "",
                username: "",
                password: "",
                challenge: "",
                bridge: "Default",
                port: 51826,
                errors: [],
                message: "",
            };
        },

        async mounted() {
            this.$theme.set("dark");
            this.loading = false;
        },

        methods: {
            async wait(callback, compare, saftey) {
                const results = await callback();

                if (compare(results)) return results;
                if ((saftey || 0) >= 300) return results;

                await Sleep(1000);

                return this.wait(callback, compare, (saftey || 0) + 1);
            },

            async account() {
                this.errors = [];

                if (this.username.length < 3) this.errors.push(this.$t("username_required"));
                if (this.password.length < 5) this.errors.push(this.$t("password_weak"));
                if (this.password !== this.challenge) this.errors.push(this.$t("password_mismatch"));

                if (this.errors.length === 0) {
                    this.loading = true;
                    this.message = `${this.$t("user_add_creating")} ...`;

                    await this.$hoobs.users.add(this.username.toLowerCase(), this.password, this.name, true);

                    if (await this.$hoobs.auth.login(this.username.toLowerCase(), this.password)) {
                        this.$router.push({ path: "/" });
                    } else {
                        this.loading = false;
                        this.errors.push(this.$t("user_add_failed"));
                    }
                }
            },

            async disable() {
                this.loading = true;
                this.message = `${this.$t("disable_login_disabling")} ...`;

                await this.$hoobs.auth.disable();
                await this.wait(this.$hoobs.auth.status, (value) => value === "disabled");

                this.$router.push({ path: "/" });
            },

            download() {
                window.location.href = "https://support.hoobs.org/downloads/desktop";
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

        .form {
            flex: 1;
            background: var(--modal-form);
            padding: 20px;
            margin: 0 10px;

            &.downloads {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                margin: 0 10px 10% 10px;
                text-align: center;
                cursor: default;
                user-select: none;
            }

            .download {
                height: unset;
                padding: 14px 27px;
                margin: 14px 0 0 0;
                background: var(--button-primary);
                color: var(--button-primary-text);

                svg {
                    margin: 0 7px 0 0;

                    path {
                        fill: var(--button-primary-text);
                    }
                }
            }
        }
    }

    [platform="mobile"] {
        #setup {
            padding: 0;
            background: unset;
            align-items: unset;

            .errors {
                border-bottom: 0 none;
            }

            .form {
                border: unset;
                padding: unset;
            }
        }
    }

    [platform="tablet"] {
        @media only screen and (orientation:portrait) {
            #setup {
                padding: 0;
                background: unset;
                align-items: unset;

                .errors {
                    border-bottom: 0 none;
                }

                .form {
                    border: unset;
                    padding: unset;
                }
            }
        }
    }
</style>
