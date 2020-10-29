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
    <div v-if="value" v-on:mouseenter="toggle(true)" v-on:mouseleave="toggle(false)" id="notifications">
        <div class="title">{{ $t("notifications") }}</div>
        <div v-if="notifications.length === 0" class="empty">{{ $t("notifications_empty") }}</div>
        <div v-else class="list">
            <notification  v-for="(notification, index) in notifications" :key="index" :message="notification" />
        </div>
    </div>
</template>

<script>
    import Notification from "./elements/notification.vue";

    export default {
        name: "notifications",

        components: {
            "notification": Notification,
        },

        props: {
            value: Boolean,
        },

        computed: {
            notifications() {
                return this.$store.state.notifications;
            },
        },

        data() {
            return {
                active: true,
                timeout: undefined,
            };
        },

        methods: {
            toggle(value) {
                this.active = value;

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    this.close();
                }, 2 * 1000);
            },

            close(now) {
                if (now || !this.active) {
                    this.$emit("input", !this.value);
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #notifications {
        width: 370px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: var(--application-drawer);
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.4),
                0 4px 5px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.7);

        .title {
            color: var(--application-highlight);
            border-bottom: var(--application-border) 1px solid;
            margin: 14px;
            padding: 0 0 7px 0;
        }

        .list {
            flex: 1;
            overflow: hidden;

            &:hover {
                overflow: overlay;
            }
        }

        .empty {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding: 0 0 20% 0;
            font-size: 14px;
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #notifications {
            overflow: auto;
        }
    }
</style>
