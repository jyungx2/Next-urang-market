export default async function handler(req, res) {
  const { address } = req.query;

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    address
  )}`;

  const kakaoRes = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
    },
  });

  const data = await kakaoRes.json();

  if (!kakaoRes.ok || !data.documents?.length) {
    return res.status(500).json({ message: "주소 변환 실패", data });
  }

  return res.status(200).json(data);
}
