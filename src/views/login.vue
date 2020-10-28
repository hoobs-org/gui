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
    <div id="login">
        <div class="form">
            <welcome :message="$t('login')" />
            <div
                v-if="errors.length > 0"
                class="errors"
            >
                <span
                    v-for="(error, index) in errors"
                    :key="index"
                >{{ error }}</span>
            </div>
            <form
                class="modal"
                autocomplete="false"
                method="post"
                action="/login"
                v-on:submit.prevent="login()"
            >
                <div class="group">
                    <div class="upper">
                        <label
                            for="username"
                            class="title"
                        >{{ $t("username") }}</label>
                        <input
                            type="text"
                            id="username"
                            autocomplete="false"
                            v-model="username"
                            v-on:keyup.enter="login"
                            :required="true"
                        />
                    </div>
                    <div class="lower">
                        <label
                            for="password"
                            class="title"
                        >{{ $t("password") }}</label>
                        <input
                            type="password"
                            id="password"
                            autocomplete="false"
                            v-model="password"
                            v-on:keyup.enter="login"
                            :required="true"
                        />
                    </div>
                </div>
                <div class="remember">
                    <checkbox
                        id="remember"
                        v-model="remember"
                    > <label for="remember">{{ $t("remember_me") }}</label></checkbox>
                </div>
            </form>
            <div class="actions modal">
                <div class="copyright">
                    HOOBS and the HOOBS logo are registered trademarks of HOOBS, Inc.<br>
                    Copyright &copy; 2020 HOOBS, Inc. All rights reserved.
                </div>
                <div
                    class="button primary"
                    @click="login()"
                >{{ $t("login") }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Checkbox from "vue-material-checkbox";
    import Welcome from "../components/elements/welcome.vue";

    export default {
        components: {
            "checkbox": Checkbox,
            "welcome": Welcome,
        },

        data() {
            return {
                url: "/",
                username: "",
                password: "",
                remember: true,
                errors: [],
            };
        },

        async mounted() {
            this.url = this.$route.query.url || "/";

            if (this.url.startsWith("/login")) this.url = "/";
        },

        methods: {
            async login() {
                this.errors = [];

                if (this.username === "" || this.username.length < 3) {
                    this.errors.push(this.$t("invalid_username_password"));
                }

                if (this.errors.length === 0) {
                    if (await this.hoobs.auth.login(this.username.toLowerCase(), this.password, this.remember)) {
                        this.$router.push({ path: this.url });
                    } else {
                        this.errors.push(this.$t("invalid_username_password"));

                        this.username = "";
                        this.password = "";
                    }
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #login {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 20px 20px 10em 20px;
        background: var(--splash-background);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;

        .form {
            width: 420px;
            min-height: 20px;
            max-height: 100%;
            overflow: auto;
            display: flex;
            flex-direction: column;
            padding: 20px;
            color: var(--modal-text);
            background: var(--modal-background);
            border-radius: 3px;
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.4),
                        0 4px 5px 0 rgba(0, 0, 0, 0.5),
                        0 1px 10px 0 rgba(0, 0, 0, 0.7);

            .errors {
                margin: 0 0 20px 0;
                padding: 0 0 20px 0;
                display: flex;
                flex-direction: column;
                font-size: 14px;
                color: var(--modal-error-text);
                border-bottom: var(--modal-border) 1px solid;
            }

            form {
                flex: 1;
            }

            .group {
                .upper {
                    display: flex;
                    flex-direction: column;
                    background: var(--modal-input);
                    padding: 10px 5px 5px 5px;
                    border-top: 1px var(--modal-border) solid;
                    border-right: 1px var(--modal-border) solid;
                    border-bottom: 1px var(--modal-border) solid;
                    border-left: 1px var(--modal-border) solid;
                    border-radius: 3px 3px 0 0;

                    &:focus-within {
                        background: var(--modal-input-accent);
                    }
                }

                &:focus-within {
                    .upper {
                        border-top: 1px var(--modal-highlight) solid;
                        border-right: 1px var(--modal-highlight) solid;
                        border-left: 1px var(--modal-highlight) solid;
                    }

                    .lower {
                        border-right: 1px var(--modal-highlight) solid;
                        border-bottom: 1px var(--modal-highlight) solid;
                        border-left: 1px var(--modal-highlight) solid;
                    }
                }

                .lower {
                    display: flex;
                    flex-direction: column;
                    background: var(--modal-input);
                    padding: 10px 5px 5px 5px;
                    border-right: 1px var(--modal-border) solid;
                    border-bottom: 1px var(--modal-border) solid;
                    border-left: 1px var(--modal-border) solid;
                    border-radius: 0 0 3px 3px;

                    &:focus-within {
                        background: var(--background-accent);
                    }
                }

                input {
                    border: 0 none;
                    outline: 0 none;
                    background: transparent;
                    color: var(--modal-input-text);
                    font-size: 15px;
                    padding: 5px;

                    &:focus {
                        border: 0 none;
                        outline: 0 none;
                    }
                }

                .title {
                    padding: 0 5px;
                    font-size: 12px;
                    user-select: none;
                }
            }

            .remember {
                display: flex;
                align-content: center;
                align-items: center;
                padding: 7px 0 0 2px;
            }

            .actions {
                margin: 10px -10px 0 0;
                display: flex;
                justify-content: flex-end;

                .copyright {
                    flex: 1;
                    font-size: 9px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    opacity: 0.4;
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #login {
            padding: 0;
            background: unset;
            align-items: unset;

            .form {
                flex: 1;
                width: unset;
                min-height: unset;
                max-height: unset;
                border-radius: unset;

                .actions {
                    .copyright {
                        display: none;
                    }
                }
            }
        }
    }
</style>
