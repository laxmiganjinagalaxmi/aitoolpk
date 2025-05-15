
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil",
        });

        return config;
    },
    images: {
        domains: [
            "res.cloudinary.com", "oaidalleapiprodscus.blob.core.windows.net", "utfs.io", "ypxcetvwzxqhohzyjjmz.supabase.co", "i.imgur.com", "www.google.com"
        ]
    },
};

module.exports = nextConfig;
