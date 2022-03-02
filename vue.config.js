const { resolve } = require("path");

module.exports = {
    outputDir: resolve(__dirname, "./dist/usr/lib/hoobs"),

    devServer: { disableHostCheck: true },

    configureWebpack: {
        performance: { hints: false },
        optimization: { runtimeChunk: "single" },
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
