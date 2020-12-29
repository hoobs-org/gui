<template>
    <div id="directive" :class="type === 'checkbox' || type === 'radio' ? 'collapsed' : 'normal'">
        <component
            :is="type"
            :title="schema.title"
            :description="schema.description"
            :placeholder="schema.placeholder || schema.example"
            :min="schema.minimum"
            :max="schema.maximum"
            :schema="schema"
            :value="value"
            :options="options"
            v-on:input="$emit('input', $event)"
        />
    </div>
</template>

<script>
    import FormField from "@/components/fields/form.vue";
    import ListField from "@/components/fields/list.vue";
    import OneOfField from "@/components/fields/oneof.vue";
    import AnyOfField from "@/components/fields/anyof.vue";

    export default {
        name: "schema",

        components: {
            "form-field": FormField,
            "list-field": ListField,
            "oneof-field": OneOfField,
            "anyof-field": AnyOfField,
        },

        props: [
            "schema",
            "value",
        ],

        computed: {
            type() {
                if (this.schema.widget !== undefined) {
                    if (this.schema.widget === "textarea") return "textarea-field";
                } else if (this.schema.oneOf !== undefined && Array.isArray(this.schema.oneOf)) {
                    return "oneof-field";
                } else if (this.schema.enum !== undefined && Array.isArray(this.schema.enum)) {
                    return "select-field";
                } else if (this.schema.type === "boolean") {
                    return "checkbox";
                } else if (this.schema.type === "array") {
                    return this.schema.items.anyOf === undefined || !Array.isArray(this.schema.items.anyOf) ? "list-field" : "anyof-field";
                } else if (this.schema.type === "object") {
                    return "form-field";
                } else if (this.schema.type === "integer") {
                    return "integer-field";
                } else if (this.schema.type === "number") {
                    return "number-field";
                } else if (this.schema.format === "date") {
                    return "date-field";
                }

                return "text-field";
            },

            options() {
                if (this.schema.enum !== undefined && Array.isArray(this.schema.enum)) {
                    return this.schema.enum.map((item) => ({ value: item, text: item }));
                }

                return [];
            },
        },
    };
</script>

<style lang="scss" scoped>
    #directive {
        margin: 20px 0 0 0;

        &:first-child {
            margin: 0;
        }

        &.collapsed {
            margin: 0;
        }
    }
</style>
