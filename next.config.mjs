/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public'
})


const nextConfig = {
    images: {
        domains: ["oaidalleapiprodscus.blob.core.windows.net"]
    }
};



module.exports = withPWA(nextConfig)