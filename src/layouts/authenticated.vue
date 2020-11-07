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
    <div v-on:click="reset()" id="authenticated">
        <navigation />
        <div class="screen">
            <slot />
        </div>
        <notifications v-if="show.notifications" v-model="show.notifications" />
        <alert
            v-if="show.alert"
            :message="alert.message"
            :close="() => { show.alert = false; }"
        />
        <confirm
            v-if="show.confirm"
            :callback="confirm.callback"
            :message="confirm.message"
            :action="confirm.action"
            :close="() => { show.confirm = false; }"
        />
    </div>
</template>

<script>
    import Alert from "@/components/dialogs/alert.vue";
    import Confirm from "@/components/dialogs/confirm.vue";
    import Navigation from "@/components/navigation.vue";
    import Notifications from "@/components/notifications.vue";

    export default {
        name: "authenticated",

        components: {
            "alert": Alert,
            "confirm": Confirm,
            "navigation": Navigation,
            "notifications": Notifications,
        },

        computed: {
            notifications() {
                return this.$store.state.notifications;
            },
        },

        data() {
            return {
                show: {
                    notifications: false,
                    application: false,
                    personalize: false,
                    dashboard: false,
                    instances: false,
                    settings: false,
                    plugins: false,
                    confirm: false,
                    about: false,
                    alert: false,
                },
                alert: {
                    message: "",
                },
                confirm: {
                    callback: () => { /* null */ },
                    message: "",
                    action: "",
                },
            };
        },

        async created() {
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === "ALERT:SHOW") {
                    this.alert.message = state.alert.message;
                    this.show.alert = true;
                }

                if (mutation.type === "CONFIRM:SHOW") {
                    this.confirm.message = state.confirm.message;
                    this.confirm.action = state.confirm.action;
                    this.confirm.callback = state.confirm.callback;

                    this.show.confirm = true;
                }
            });

            this.$store.commit("AUTH:STATE", (await this.$hoobs.auth.status()));
        },

        methods: {
            reset(ignore) {
                const keys = Object.keys(this.show);

                for (let i = 0; i < keys.length; i += 1) {
                    if (keys[i] !== (ignore || "")) this.show[keys[i]] = false;
                }
            },

            toggle(field) {
                this.reset(field);

                this.show[field] = !this.show[field];
            },

            navigate(url) {
                window.open(url);
            },
        },
    };
</script>

<style lang="scss">
    #authenticated {
        width: 100%;
        height: 100%;
        display: flex;
        font-family: "Montserrat", sans-serif;
        color: var(--application-text);
        background: var(--application-background);

        .screen {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .tray {
            position: absolute;
            top: 2px;
            right: 0;
            display: flex;
            padding: 0 0 0 10px;
            justify-content: flex-end;
            z-index: 1100;

            .icon {
                width: 28px;
                height: 28px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                border-radius: 100%;
                font-size: 20px;
                margin: 5px 0;
                cursor: pointer;

                .active {
                    font-size: 32px;
                    position: absolute;
                    right: 4px;
                    color: var(--application-error-text);
                }

                &:last-child {
                    margin: 5px 10px 5px 0;
                }

                &:hover {
                    color: var(--application-highlight-text);
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #authenticated {
            flex-direction: column;
        }
    }
</style>
