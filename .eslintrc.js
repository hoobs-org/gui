module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "@vue/airbnb",
        "@vue/typescript/recommended",
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020,
    },
    rules: {
        quotes: [
            "error",
            "double",
        ],
        "comma-dangle": [
            "error",
            "always-multiline",
        ],
        indent: [
            "error",
            4,
            {
                SwitchCase: 1,
            },
        ],
        "max-len": [
            "error",
            {
                code: 220,
            },
        ],
        "vue/script-indent": [
            "error",
            4,
            {
                baseIndent: 1,
                switchCase: 1,
            },
        ],
        "vue/html-indent": [
            "error",
            4,
            {
                attribute: 1,
                baseIndent: 1,
            },
        ],
        "@typescript-eslint/quotes": [
            "error",
            "double",
        ],
        "@typescript-eslint/indent": [
            "error",
            4,
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "spaced-comment": "off",
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
    overrides: [
        {
            files: [
                "*.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
            },
        },
        {
            files: [
                "*.ts",
            ],
            rules: {
                "@typescript-eslint/explicit-module-boundary-types": ["error"],
            },
        },
        {
            files: [
                "src/components/accessories/camera.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
                "vue/no-deprecated-destroyed-lifecycle": "off",
            },
        },
        {
            files: [
                "src/components/dialogs/settings.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
                "@typescript-eslint/camelcase": "off",
            },
        },
        {
            files: [
                "src/components/dialogs/updates.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
                "no-await-in-loop": "off",
            },
        },
        {
            files: [
                "src/components/elements/player.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
                "vue/no-deprecated-destroyed-lifecycle": "off",
            },
        },
        {
            files: [
                "src/components/elements/message.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
                "no-bitwise": "off",
            },
        },
        {
            files: [
                "src/components/elements/detail.vue",
            ],
            rules: {
                indent: "off",
                "quote-props": "off",
                "@typescript-eslint/indent": "off",
                "no-bitwise": "off",
            },
        },
        {
            files: [
                "src/plugins/drag.ts",
            ],
            rules: {
                "no-param-reassign": "off",
                "max-len": "off",
            },
        },
        {
            files: [
                "src/services/maps.ts",
            ],
            rules: {
                "padded-blocks": "off",
                "@typescript-eslint/ban-ts-ignore": "off",
            },
        },
        {
            files: [
                "bin/build",
            ],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
                "import/no-extraneous-dependencies": "off",
            },
        },
        {
            files: [
                "vue.config.js",
            ],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
            },
        },
        {
            files: [
                "*.html",
            ],
            rules: {
                "vue/comment-directive": "off",
            },
        },
        {
            files: [
                "src/lang/index.ts",
            ],
            rules: {
                "import/no-dynamic-require": "off",
                "global-require": "off",
            },
        },
        {
            files: [
                "src/services/schema.ts",
            ],
            rules: {
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "no-else-return": "off",
                "no-restricted-syntax": "off",
                "guard-for-in": "off",
                "consistent-return": "off",
            },
        },
    ],
};
