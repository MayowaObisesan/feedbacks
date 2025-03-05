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
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'ALLOWALL', // 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: "Content-Security-Policy",
                        // Allow embedding on any site
                        value: "frame-ancestors *", // "frame-ancestors 'self' https://your-allowed-site.com;"
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
