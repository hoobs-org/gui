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
    <div id="context">
        <div class="page">
            <slot />
        </div>
        <div class="system">
            <div v-on:click.stop="toggle('notifications')" class="icon">
                notifications_none
                <div v-if="notifications.length > 0" class="active">&bull;</div>
            </div>
            <div v-on:click.stop="toggle('application')" class="icon">more_vert</div>
        </div>
        <application-menu
            v-if="parent.show.application"
            :about="() => { toggle('about') }"
            :help="() => navigate('https://support.hoobs.org/docs')"
            :settings="() => { toggle('settings') }"
            :personalize="() => { toggle('personalize') }"
            :terminal="terminal"
            :close="() => { toggle('application') }"
            :logout="logout"
        />
        <about v-if="parent.show.about" :close="() => { toggle('about') }" />
        <settings v-if="parent.show.settings" :close="() => { toggle('settings') }" />
        <personalize v-if="parent.show.personalize" :close="() => { toggle('personalize') }" />
    </div>
</template>

<script>
    import About from "@/components/dialogs/about.vue";
    import Settings from "@/components/dialogs/settings.vue";
    import Personalize from "@/components/dialogs/personalize.vue";
    import ApplicationMenu from "@/components/menus/application.vue";

    export default {
        name: "context",

        components: {
            "about": About,
            "settings": Settings,
            "personalize": Personalize,
            "application-menu": ApplicationMenu,
        },

        computed: {
            parent() {
                return this.$parent.$parent;
            },

            notifications() {
                return this.$store.state.notifications;
            },
        },

        async created() {
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === "DIALOG:SHOW") {
                    this.toggle(state.dialog);
                }
            });
        },

        methods: {
            async logout() {
                this.parent.reset();

                await this.$hoobs.auth.logout();

                this.$router.push({ path: "/login", query: { url: "/" } });
            },

            terminal() {
                this.parent.show.application = false;

                if (this.$route.name !== "terminal") this.$router.push({ path: "/terminal" });
            },

            toggle(field) {
                this.parent.toggle(field);
            },

            navigate(url) {
                this.parent.reset();

                window.open(url);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #context {
        height: 38px;
        background: var(--application-background);
        display: flex;
        flex-direction: row;
        align-content: center;

        .page {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-content: center;
            padding: 2px 0 0 7px;

            .icon {
                font-size: 18px;
            }
        }

        .system {
            display: flex;
            flex-direction: row;
            align-content: center;
            padding: 2px 7px 0 0;

            .icon {
                font-size: 20px;
            }
        }

        .seperator {
            width: 1px;
            height: 18px;
            background: var(--navigation-border);
            margin: 10px 7px;
        }

        .icon {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: relative;
            border-radius: 100%;
            font-size: 18px;
            margin: 5px 0;
            cursor: pointer;

            .active {
                font-size: 32px;
                position: absolute;
                right: 4px;
                color: var(--application-error-text);
            }

            &:hover {
                color: var(--application-highlight-text);
            }
        }

        .button {
            height: auto;
            display: flex;
            flex-direction: row;
            align-content: center;
            background: var(--application-background);
            color: var(--application-text) !important;
            border: 0 none;
            font-size: 13px;
            padding: 0;
            margin: 5px 5px 5px 0;

            .icon {
                margin: 0 -3px 0 0;
                font-size: 18px;
            }

            &:hover {
                color: var(--application-highlight-text) !important;
                box-shadow: none !important;
            }
        }
    }
</style>
