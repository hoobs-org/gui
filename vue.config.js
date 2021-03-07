const { resolve } = require("path");

module.exports = {
    outputDir: resolve(__dirname, "./lib/hoobs"),

    configureWebpack: {
        performance: {
            hints: false,
        },
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
        config.performance.maxEntrypointSize(400000).maxAssetSize(400000);

        config.plugin("html").tap((args) => {
            const payload = args;

            payload[0].title = "HOOBS";

            return payload;
        });
    },
};
