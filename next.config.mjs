/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// 💡 추가 설명
// 1. protocol: 보통 https
// 2. hostname: 이미지가 호스팅된 외부 도메인 (너는 res.cloudinary.com)
// 3. pathname: 외부 URL 중 어떤 경로까지 허용할지를 지정 (/**로 하면 모든 경로 허용)
// 4. 이 설정이 없으면 Next는 해당 이미지를 최적화할 수 없기 때문에 <Image>가 거부합니다.
