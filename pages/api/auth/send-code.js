import coolsms from "coolsms-node-sdk";

// 임시 저장용 (개발단계에선 메모리, 나중엔 Redis 추천)
const codeStore = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { phoneNumber } = req.body;
  if (!phoneNumber)
    return res.status(400).json({ error: "전화번호가 필요합니다" });

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // 1. 인증번호 문자 전송
  // 🚨✅ coolsms.default is not a constructor
  const messageService = new coolsms(
    process.env.COOLSMS_API_KEY,
    process.env.COOLSMS_API_SECRET
  );

  try {
    await messageService.sendOne({
      to: phoneNumber,
      from: process.env.COOLSMS_SENDER, // 사전에 등록된 발신번호 (010-xxxx-xxxx)
      text: `[유랑마켓] 인증번호는 ${verificationCode} 입니다.`,
    });

    // 2. 인증번호 임시 저장 (3분 후 만료)
    codeStore.set(phoneNumber, {
      code: verificationCode,
      expiresAt: Date.now() + 3 * 60 * 1000,
    });

    return res.status(200).json({ message: "인증번호 전송 완료" });
  } catch (error) {
    console.error("SMS 전송 실패:", error);
    return res.status(500).json({ error: "문자 전송 실패" });
  }
}

// 인증번호 검증용 함수 (나중에 import해서 사용)
export function verifyCode(phoneNumber, inputCode) {
  const record = codeStore.get(phoneNumber);
  if (!record) return false;
  const isExpired = Date.now() > record.expiresAt;
  const isValid = record.code === inputCode;
  if (isValid && !isExpired) {
    codeStore.delete(phoneNumber); // 일회용 인증번호 제거
    return true;
  }
  return false;
}
