/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "rolluplab.io",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "daisyui.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "moccasin-many-grasshopper-363.mypinata.cloud",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "nextui.org",
                port: "",
                pathname: "/**",
            },
        ],
    },
}

module.exports = nextConfig
