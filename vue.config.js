const { resolve } = require("path");

module.exports = {
    outputDir: resolve(__dirname, "./lib/hoobs"),

    configureWebpack: {
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            return `module.${(module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]).replace("@", "")}`;
                        },
                    },
                },
            },
        },
    },

    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            const payload = args;

            payload[0].title = "HOOBS";

            return payload;
        });
    },
};
