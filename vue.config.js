const { resolve } = require("path");

module.exports = {
    outputDir: resolve(__dirname, "./lib"),

    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            const payload = args;

            payload[0].title = "HOOBS";

            return payload;
        });
    },
};
