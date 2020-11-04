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
            <div v-if="!show.application" class="tray">
                <div v-on:click.stop="toggle('notifications')" class="icon">
                    notifications_none
                    <div v-if="notifications.length > 0" class="active">&bull;</div>
                </div>
                <div v-on:click.stop="toggle('application')" class="icon">more_vert</div>
            </div>
            <slot />
        </div>
        <notifications v-if="show.notifications" v-model="show.notifications" />
        <application-menu
            v-if="show.application"
            :about="() => { toggle('about') }"
            :help="() => navigate('https://support.hoobs.org/docs')"
            :settings="() => { toggle('settings') }"
            :personalize="() => { toggle('personalize') }"
            :terminal="terminal"
            :close="() => { toggle('application') }"
            :logout="logout"
        />
        <about v-if="show.about" :close="() => { toggle('about') }" />
        <settings v-if="show.settings" :close="() => { toggle('settings') }" />
        <personalize v-if="show.personalize" :close="() => { toggle('personalize') }" />
        <confirm
            v-if="show.confirmation"
            :message="confirmation.message"
            :ok="confirmation.ok"
            :confirm="confirmation.action"
            :close="() => { show.confirmation = false; }"
        />
    </div>
</template>

<script>
    import About from "../components/dialogs/about.vue";
    import Confirm from "../components/dialogs/confirm.vue";
    import Navigation from "../components/navigation.vue";
    import Notifications from "../components/notifications.vue";
    import ApplicationMenu from "../components/menus/application.vue";
    import Personalize from "../components/dialogs/personalize.vue";
    import Settings from "../components/dialogs/settings.vue";

    export default {
        name: "authenticated",

        components: {
            "about": About,
            "confirm": Confirm,
            "settings": Settings,
            "navigation": Navigation,
            "personalize": Personalize,
            "notifications": Notifications,
            "application-menu": ApplicationMenu,
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
                    about: false,
                    settings: false,
                    personalize: false,
                    confirmation: false,
                },
                confirmation: {
                    action: () => { /* null */ },
                    message: "",
                    ok: "",
                },
            };
        },

        async created() {
            const status = await this.hoobs.auth.status();

            this.$store.commit("AUTH:STATE", status);
        },

        methods: {
            async logout() {
                this.reset();

                await this.hoobs.auth.logout();

                this.$router.push({ path: "/login", query: { url: "/" } });
            },

            confirm(message, ok, action) {
                this.confirmation.message = message;
                this.confirmation.ok = ok;
                this.confirmation.action = action;

                this.show.confirmation = true;
            },

            reset(ignore) {
                const keys = Object.keys(this.show);

                for (let i = 0; i < keys.length; i += 1) {
                    if (keys[i] !== (ignore || "")) this.show[keys[i]] = false;
                }
            },

            terminal() {
                this.show.application = false;

                if (this.$route.name !== "terminal") this.$router.push({ path: "/terminal" });
            },

            help() {
                this.reset();
            },

            toggle(value) {
                this.reset(value);

                this.show[value] = !this.show[value];
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
        }

        .tray {
            height: 48px;
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            padding: 0 0 0 7px;
            justify-content: flex-end;
            background: var(--application-background);
            box-shadow: var(--elevation-button);
            border-radius: 24px;
            z-index: 1100;

            .icon {
                width: 34px;
                height: 34px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                border-radius: 100%;
                margin: 7px 0;
                cursor: pointer;

                .active {
                    font-size: 32px;
                    position: absolute;
                    right: 4px;
                    color: var(--application-error-text);
                }

                &:last-child {
                    margin: 7px 7px 7px 0;
                }

                &:hover {
                    background: var(--application-input-accent);
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
