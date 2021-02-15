<template>
    <div id="control" :class="on ? 'on' : 'off'">
        <div class="item">
            <div class="switch">
                <div v-if="on" class="inner" v-on:click="toggle">
                    <span :class="`mdi mdi-${accessory.icon && accessory.icon !== '' ? accessory.icon : 'toggle-switch'}`"></span>
                </div>
                <div v-else class="inner" v-on:click="toggle">
                    <span :class="`mdi mdi-${accessory.icon && accessory.icon !== '' ? accessory.icon : 'toggle-switch-off'}`"></span>
                </div>
            </div>
            <div class="settings">
                <span class="mdi mdi-cog"></span>
            </div>
        </div>
        <div class="name">{{ accessory.name }}</div>
    </div>
</template>

<script>
    import Debounce from "lodash.debounce";

    const UPDATE_DELAY = 150;
    const LOCAL_DELAY = 1000;

    export default {
        name: "switch-accessory",

        props: {
            disabled: Boolean,
            accessory: {
                type: Object,
                required: true,
            },
        },

        data() {
            return {
                on: false,
                local: false,
                subject: null,
                updater: Debounce(() => {
                    if (!this.local) {
                        this.on = (this.subject.characteristics.find((item) => item.type === "on") || {}).value || false;
                    }
                }, UPDATE_DELAY),
            };
        },

        created() {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === "IO:ACCESSORY:CHANGE" && mutation.payload.data.accessory.accessory_identifier === this.accessory.accessory_identifier) {
                    this.subject = mutation.payload.data.accessory;
                    this.updater();
                }
            });
        },

        mounted() {
            this.subject = this.accessory;
            this.updater();
        },

        methods: {
            async toggle() {
                this.local = true;

                const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);
                const on = !this.on;

                this.on = on;

                await accessory.set("on", on);

                setTimeout(() => { this.local = false; }, LOCAL_DELAY);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #control {
        width: 100%;
        display: flex;
        flex-direction: column;

        .item {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            position: relative;
        }

        .name {
            text-align: center;
            padding: 14px 7px 7px 7px;
        }

        .settings {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            opacity: 0.3;
            cursor: pointer;

            .mdi {
                font-size: 22px;
            }

            &:hover {
                opacity: 1;
            }
        }

        .switch {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 3%;
            box-sizing: border-box;
            pointer-events: none;
            border: 2px var(--application-border) solid;
            border-radius: 50%;
            top: 0;
            left: 0;

            .inner {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                box-sizing: border-box;
                background: var(--application-input-accent);
                pointer-events: all;
                border-radius: 50%;
                cursor: pointer;

                .mdi {
                    color: var(--application-input-text);
                    font-size: 400%;
                    opacity: 0.1;
                }
            }
        }

        &.on {
            .switch {
                .inner {
                    background: var(--application-highlight);

                    .mdi {
                        color: #fff;
                        opacity: 1;
                    }
                }
            }
        }

        &:hover {
            .settings {
                display: block;
            }
        }
    }
</style>
