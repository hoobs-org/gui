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
    <div v-on:click="reset()" id="layout">
        <navigation />
        <div class="screen">
            <div class="header">
                <div v-on:click.stop="toggle('notifications')" class="icon">
                    notifications_none
                    <div v-if="notifications.length > 0" class="active">&bull;</div>
                </div>
                <div v-on:click.stop="toggle('service')" class="icon">more_vert</div>
            </div>
            <slot />
        </div>
        <notifications v-if="show.notifications" v-model="show.notifications" />
        <service-menu
            v-if="show.service"
            :about="() => { toggle('about') }"
            :help="() => navigate('https://support.hoobs.org/docs')"
            :close="() => { toggle('service') }"
            :logout="logout"
        />
        <modal v-if="show.about" width="720px" height="420px">
            <welcome message="HOOBS™" />
            <about
                :donate="() => { navigate('https://paypal.me/hoobsorg') }"
                :close="() => { toggle('about') }"
            />
        </modal>
    </div>
</template>

<script>
    import About from "./components/elements/about.vue";
    import Navigation from "./components/navigation.vue";
    import Notifications from "./components/notifications.vue";
    import ServiceMenu from "./components/menus/service.vue";

    export default {
        components: {
            "about": About,
            "navigation": Navigation,
            "notifications": Notifications,
            "service-menu": ServiceMenu,
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
                    service: false,
                    about: false,
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

                this.showServiceMenu = false;

                await this.hoobs.auth.logout();

                this.$router.push({ path: "/login", query: { url: "/" } });
            },

            reset(ignore) {
                const keys = Object.keys(this.show);

                for (let i = 0; i < keys.length; i += 1) {
                    if (keys[i] !== (ignore || "")) {
                        this.show[keys[i]] = false;
                    }
                }
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
    #layout {
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

        .header {
            display: flex;
            justify-content: flex-end;

            .icon {
                width: 34px;
                height: 34px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                border-radius: 17px;
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
</style>
