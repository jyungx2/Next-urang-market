export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { lat, lng } = req.query;

  const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`;

  console.log(process.env.KAKAO_REST_API_KEY);

  const kakaoRes = await fetch(apiUrl, {
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
    },
  });
  console.log("🔍 kakaoRes status:", kakaoRes.status); // 꼭 찍어보기

  const data = await kakaoRes.json();
  console.log("📦 kakao API 응답 데이터:", data);

  if (!kakaoRes.ok || !data.documents?.length) {
    return res.status(500).json({ message: "카카오 역지오코딩 실패" });
  }

  let region = data.documents.find((doc) => doc.region_type === "H"); // 행정동 (주민센터 운영기준, 더 자세한 동 정보 가지고 있음)

  if (!region) {
    region = data.documents.find((doc) => doc.region_type === "B");
  }

  if (!region) {
    return res
      .status(404)
      .json({ message: "유효한 지역 정보를 찾을 수 없습니다." });
  }

  const fullAddress = `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`;

  res.status(200).json({ regionName: fullAddress });
}
