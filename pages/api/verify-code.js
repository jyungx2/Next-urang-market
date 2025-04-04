import { verifyCode } from "./send-code"; // 같은 폴더에 있는 코드 재사용

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phoneNumber, code } = req.body;

  const success = verifyCode(phoneNumber, code);

  if (!success) {
    return res
      .status(400)
      .json({ error: "인증번호가 일치하지 않거나 만료되었습니다." });
  }

  // TODO: 여기서 사용자 DB 확인 → 없으면 회원가입, 있으면 로그인 처리
  // 또는 next-auth credentials 방식으로 넘기기

  return res.status(200).json({ message: "인증 성공" });
}
