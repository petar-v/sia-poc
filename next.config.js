/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
    reactStrictMode: true,

    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },

    webpack: (config) => {
        config.module.rules.push({
            test: /\.txt$/i,
            loader: "raw-loader",
        });

        return config;
    },
};

module.exports = nextConfig;
