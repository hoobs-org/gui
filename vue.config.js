const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "./lib"),

    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            const payload = args;

            payload[0].title = "HOOBS";

            return payload;
        });
    },
};
