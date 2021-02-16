<template>
    <div id="control" :class="on ? 'on' : 'off'">
        <div :class="style">
            <div v-if="features.brightness && on" class="background">
                <div class="inner"></div>
            </div>
            <svg v-if="features.brightness && on" viewBox="0 0 100 100" v-on:click.stop="select" v-on:mousedown.prevent="start(true)" v-on:touchstart.prevent="start()">
                <path class="range" :d="range" />
                <path v-if="visable" class="marker" :d="marker" />
            </svg>
            <div v-if="!features.rotation" class="switch">
                <div class="inner" v-on:click="toggle">
                    <span :class="`mdi mdi-${accessory.icon && accessory.icon !== '' ? accessory.icon : 'fan'}`"></span>
                </div>
            </div>
            <div v-if="features.rotation && on" class="context">
                <div class="inner">
                    <span class="mdi mdi-palette"></span>
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

    const RADIUS = 41;

    const MID_X = 50;
    const MID_Y = 50;

    const MIN_RADIANS = (4 * Math.PI) / 3;
    const MAX_RADIANS = -Math.PI / 3;

    export default {
        name: "fan-accessory",

        props: {
            disabled: Boolean,
            accessory: {
                type: Object,
                required: true,
            },
        },

        computed: {
            style() {
                let result = "item";

                if (this.on) {
                    if (this.features.brightness) result = `${result} brightness`;
                    if (this.features.hue) result = `${result} hue`;
                }

                return result;
            },

            range() {
                return `M ${this.position.x.start} ${this.position.y.start} A ${RADIUS} ${RADIUS} 0 1 1 ${this.position.x.end} ${this.position.y.end}`;
            },

            marker() {
                return `M ${this.position.x.zero} ${this.position.y.zero} A ${RADIUS} ${RADIUS} 0 ${this.arc} ${this.sweep} ${this.active.x} ${this.active.y}`;
            },

            visable() {
                return (this.brightness >= 0 && this.brightness <= 100) && !this.disabled;
            },

            position() {
                return {
                    x: {
                        start: MID_X + Math.cos(MIN_RADIANS) * RADIUS,
                        end: MID_X + Math.cos(MAX_RADIANS) * RADIUS,
                        zero: MID_X + Math.cos(this.map(0, 0, 100, MIN_RADIANS, MAX_RADIANS)) * RADIUS,
                    },
                    y: {
                        start: MID_Y - Math.sin(MIN_RADIANS) * RADIUS,
                        end: MID_Y - Math.sin(MAX_RADIANS) * RADIUS,
                        zero: MID_Y - Math.sin(this.map(0, 0, 100, MIN_RADIANS, MAX_RADIANS)) * RADIUS,
                    },
                };
            },

            active() {
                return {
                    x: MID_X + Math.cos(this.map(this.brightness, 0, 100, MIN_RADIANS, MAX_RADIANS)) * RADIUS,
                    y: MID_Y - Math.sin(this.map(this.brightness, 0, 100, MIN_RADIANS, MAX_RADIANS)) * RADIUS,
                };
            },

            arc() {
                return Math.abs(this.map(0, 0, 100, MIN_RADIANS, MAX_RADIANS) - this.map(this.brightness, 0, 100, MIN_RADIANS, MAX_RADIANS)) < Math.PI ? 0 : 1;
            },

            sweep() {
                return this.map(this.brightness, 0, 100, MIN_RADIANS, MAX_RADIANS) > this.map(0, 0, 100, MIN_RADIANS, MAX_RADIANS) ? 0 : 1;
            },
        },

        data() {
            return {
                key: "on",
                on: false,
                speed: 0,
                rotation: 0,
                features: {
                    speed: false,
                    rotation: false,
                },
                local: false,
                subject: null,
                updater: Debounce(() => {
                    if (!this.local) {
                        const speed = this.subject.characteristics.find((item) => item.type === "brightness");
                        const rotation = this.subject.characteristics.find((item) => item.type === "saturation");

                        if (this.subject.characteristics.find((item) => item.type === "on" && item.write)) this.key = "on";
                        if (this.subject.characteristics.find((item) => item.type === "active" && item.write)) this.key = "active";
                        if (this.subject.characteristics.find((item) => item.type === "target_fan_state" && item.write)) this.key = "target_fan_state";

                        this.on = (this.subject.characteristics.find((item) => item.type === this.key) || {}).value || false;
                        this.speed = (speed || {}).value || 0;
                        this.rotation = (rotation || {}).value || 0;

                        if (speed) this.features.speed = true;
                        if (rotation) this.features.rotation = true;
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
            map(x, inMin, inMax, outMin, outMax) {
                return (((x - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;
            },

            async toggle() {
                this.local = true;

                const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);
                const on = !this.on;

                this.on = on;

                await accessory.set(this.key, on);

                setTimeout(() => { this.local = false; }, LOCAL_DELAY);
            },

            async commit(characteristic, value) {
                this.local = true;

                const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);

                await accessory.set(characteristic, value);

                setTimeout(() => { this.local = false; }, LOCAL_DELAY);
            },

            update(offsetX, offsetY) {
                const angle = Math.atan2(this.$el.clientWidth / 2 - offsetY, offsetX - this.$el.clientWidth / 2);
                const start = -Math.PI / 2 - Math.PI / 6;

                if (angle > MAX_RADIANS) {
                    this.brightness = this.map(angle, MIN_RADIANS, MAX_RADIANS, 0, 100);
                } else if (angle < start) {
                    this.brightness = this.map(angle + 2 * Math.PI, MIN_RADIANS, MAX_RADIANS, 0, 100);
                } else {
                    return;
                }

                this.on = this.brightness > 0;
                this.$emit("input", Math.round(this.brightness));
            },

            select(event) {
                if (!this.disabled) this.update(event.offsetX, event.offsetY);
            },

            start(mouse) {
                if (!this.disabled) {
                    window.addEventListener(mouse ? "mousemove" : "touchmove", mouse ? this.pointer : this.touch);
                    window.addEventListener(mouse ? "mouseup" : "touchend", mouse ? this.leave : this.stop);
                }
            },

            leave() {
                if (!this.disabled) {
                    window.removeEventListener("mousemove", this.pointer);
                    window.removeEventListener("mouseup", this.leave);

                    this.commit("rotation_speed", Math.round(this.speed));
                }
            },

            stop() {
                if (!this.disabled) {
                    window.removeEventListener("touchmove", this.touch);
                    window.removeEventListener("touchend", this.stop);

                    this.commit("rotation_speed", Math.round(this.speed));
                }
            },

            pointer(event) {
                if (!this.disabled) this.update(event.offsetX, event.offsetY);
            },

            touch(event) {
                if (!this.disabled && event.touches.length === 1) {
                    const rectangle = this.$el.getBoundingClientRect();
                    const touch = event.targetTouches.item(0);

                    this.update(touch.clientX - rectangle.left, touch.clientY - rectangle.top);
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    @keyframes dash-frame {
        100% {
            stroke-dashoffset: 0;
        }
    }

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

        .background {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 3%;
            box-sizing: border-box;
            border: 2px var(--accessory-border) solid;
            border-radius: 50%;
            top: 0;
            left: 0;

            .inner {
                width: 100%;
                height: 100%;
                position: relative;
                box-sizing: border-box;
                background: var(--accessory-background);
                border-radius: 50%;
            }
        }

        .switch {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 3%;
            box-sizing: border-box;
            pointer-events: none;
            border: 2px var(--accessory-border) solid;
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
                background: var(--accessory-background);
                pointer-events: all;
                border-radius: 50%;
                cursor: pointer;

                .mdi {
                    color: var(--accessory-text);
                    font-size: 400%;
                }
            }
        }

        .context {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 15%;
            box-sizing: border-box;
            pointer-events: none;
            border-radius: 50%;
            top: 0;
            left: 0;

            .inner {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 70% 0 0 0;
                position: relative;
                box-sizing: border-box;
                background: var(--accessory-background);
                pointer-events: all;
                clip-path: inset(71% 0 0 0);
                border-radius: 50%;
                cursor: pointer;

                .mdi {
                    color: var(--accessory-text);
                }
            }
        }

        .brightness {
            .switch {
                padding: 15%;
                border: 0 none;
            }
        }

        .hue {
            .switch {
                .inner {
                    padding: 0 0 32% 0;
                    clip-path: inset(0 0 32% 0);

                    .mdi {
                        font-size: 250%;
                    }
                }
            }
        }

        svg {
            width: 100%;
            height: 100%;
            position: absolute;
            box-sizing: border-box;
            top: 0;
            left: 0;

            .range {
                fill: none;
                stroke: var(--accessory-input);
                stroke-width: 6%;
                transition: stroke 0.1s ease-in;
                cursor: pointer;
            }

            .marker {
                fill: none;
                stroke: var(--accessory-input);
                opacity: 0;
                stroke-width: 7%;
                stroke-dasharray: 0;
                stroke-dashoffset: 0;
                animation-name: dash-frame;
                animation-fill-mode: forwards;
                cursor: pointer;
            }
        }

        &.on {
            .switch {
                .inner {
                    background: #04a3ff;

                    .mdi {
                        color: var(--accessory-highlight);
                    }
                }
            }

            .context {
                .inner {
                    background: #04a3ff;

                    .mdi {
                        color: var(--accessory-highlight);
                    }
                }
            }

            svg {
                .marker {
                    stroke: #04a3ff;
                    opacity: 1;
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
