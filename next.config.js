/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.txt$/,
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
