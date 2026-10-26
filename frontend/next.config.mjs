/** @type {import('next').NextConfig} */
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Foto dikirim sebagai data URL lewat server action, batas 4 MB
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async rewrites() {
    // Supaya login Google (redirect) tetap jalan di Safari/Chrome HP:
    // /__/auth/* diteruskan ke domain Firebase.
    if (!firebaseProjectId) return [];
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseProjectId}.firebaseapp.com/__/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
