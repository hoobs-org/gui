<template>
    <div id="control">
        <div class="item">
            <div class="background">
                <div class="sill">
                    <div class="window">
                        <div class="cover" :style="`height: ${position}%;`"></div>
                        <div class="container">
                            <div class="slider">
                                <input id="field" type="range" min="0" max="100" step="1" v-model="position" />
                            </div>
                        </div>
                    </div>
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
        name: "blind-accessory",

        props: {
            disabled: Boolean,
            accessory: {
                type: Object,
                required: true,
            },
        },

        data() {
            return {
                position: 0,
                local: false,
                subject: null,
                updater: Debounce(() => {
                    if (!this.local) {
                        this.position = (this.subject.characteristics.find((item) => item.type === "target_position") || {}).value || false;
                    }
                }, UPDATE_DELAY),
                committer: Debounce(async () => {
                    this.local = true;

                    const accessory = await this.$hoobs.accessory(this.accessory.bridge, this.accessory.accessory_identifier);
                    await accessory.set("target_position", this.position);

                    setTimeout(() => { this.local = false; }, LOCAL_DELAY);
                }, UPDATE_DELAY),
            };
        },

        watch: {
            position() {
                this.committer();
            },
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
            border-radius: 50%;
            background: var(--widget-background);
            justify-content: space-around;
            align-items: center;
            padding: 3px;
            top: -6px;
            right: -6px;
            cursor: pointer;

            .mdi {
                font-size: 22px;
                opacity: 0.3;
            }

            &:hover {
                .mdi {
                    opacity: 1;
                }
            }
        }

        .background {
            width: 100%;
            height: 100%;
            position: absolute;
            box-sizing: border-box;
            top: 0;
            left: 0;
        }

        .sill {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 7px;
            border: 2px var(--accessory-border) solid;
            padding: 20px;
        }

        .window {
            width: 100%;
            height: 100%;
            position: relative;
            background: var(--application-highlight);
            border: 1px var(--accessory-border) solid;
        }

        .cover {
            background: var(--accessory-input);
            border-bottom: 1px var(--accessory-border) solid;
            width: 100%;
            position: absolute;
            top: -1px;
            left: 0;
        }

        .container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;

            .slider {
                width: 100%;
                height: 100%;
                transform-origin: center;
                transform: rotate(90deg);

                input[type=range] {
                    -webkit-appearance: none;
                    background: transparent;
                    width: 100%;
                    height: 100%;
                    border: 0 none;
                    margin: 0;
                    padding: 0;

                    &:focus {
                        outline: none;
                    }

                    &::-webkit-slider-runnable-track {
                        width: 100%;
                        height: 0;
                    }

                    &::-webkit-slider-thumb {
                        border: 1px var(--accessory-border) solid;
                        border-radius: 50%;
                        height: 22px;
                        width: 22px;
                        background: var(--accessory-highlight);
                        cursor: pointer;
                        -webkit-appearance: none;
                        margin-top: -14px;
                    }

                    &::-moz-range-track {
                        width: 100%;
                        height: 0;
                    }

                    &::-moz-range-thumb {
                        border: 1px var(--accessory-border) solid;
                        border-radius: 50%;
                        height: 22px;
                        width: 22px;
                        background: var(--accessory-highlight);
                        cursor: pointer;
                    }

                    &::-ms-track {
                        width: 100%;
                        height: 0;
                        border-width: 0;
                    }

                    &::-ms-thumb {
                        border: 1px var(--accessory-border) solid;
                        border-radius: 50%;
                        height: 22px;
                        width: 22px;
                        background: var(--accessory-highlight);
                        cursor: pointer;
                    }
                }
            }
        }

        &:hover {
            .settings {
                display: flex;
            }
        }
    }
</style>
