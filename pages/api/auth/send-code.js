import coolsms from "coolsms-node-sdk";
import redis from "@/lib/redis";

// ⚠️ 임시 저장용 (개발단계에선 메모리, 나중엔 Redis 추천)
// => confirm 버튼 클릭시, verify-code 코드가 실행되면서 서버 리로딩 => dev모드에서는 파일 수정 시 자동으로 수정사항이 반영되는 핫리로딩 발생 & 특히 api 라우트가 수정되면 서버가 부분적으로 리스타트 => 그 파일 안에 있던 codeStore = new Map()이 다시 생성되고 초기화 => 전화번호와 인증번호의 매핑 데이터가 사라짐...!
// ✅ 해결방법: 서버 리로딩에도 값이 유지되는 저장소로 변경하는 것 => 서버 재시작에도 값 유지되는 메모리 기반 DB인 Redis 사용 필수!

// const codeStore = new Map(); // 이 파일 안에서만 유지되는 데이터 저장소

// ❌ codeStore는 send-code.js 내부에서만 유지되는 변수
// ❌ 다른 API route에서 import 하더라도 같은 메모리를 공유하지 않음

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { phoneNumber } = req.body;

  if (!phoneNumber)
    return res.status(400).json({ error: "전화번호가 필요합니다" });

  // const isDev = process.env.NODE_ENV !== "production";
  // NODE_ENV는 직접 .env.local에 지정할 필요는 없고, Next.js가 내부적으로 자동으로 설정해주는 값.
  // next dev -> process.env.NODE_ENV === "development"
  // next build + next start -> "production"
  // next test(Jest 등) -> "test"
  const isTestNumber = phoneNumber === "01000000000";

  // 💚 테스트용 번호 (CoolSMS 개발자 문서 기준)
  if (phoneNumber !== "01000000000") {
    return res.status(400).json({
      message: "휴대폰 인증 테스트는 전화번호 '010-0000-0000'로만 가능합니다.",
    });
  }

  // 🔥
  // const verificationCode = Math.floor(
  //   100000 + Math.random() * 900000
  // ).toString();

  // 💚 개발 중엔 항상 성공 응답 처리되는 고정된 mock 인증번호(123456) 사용
  const verificationCode = isTestNumber
    ? "123456"
    : Math.floor(100000 + Math.random() * 900000).toString();

  if (isTestNumber) {
    // 1. Redis에 저장 (테스트도 인증 흐름 검증을 위해 저장!)
    // const EXPIRE_TIME = Number(process.env.SMS_CODE_EXPIRES || 180);
    await redis.set(phoneNumber, verificationCode, { ex: 180 });

    // 2. 문자 전송 없이 바로 성공 응답
    return res.status(200).json({
      message: "테스트용 인증번호 전송 완료",
      mockCode: verificationCode,
    });
  } else {
    // 🔥 요금제 갱신 후에 실행되는 실제 사용자 전화번호로 문자가 전송되는 로직
    // 1. 인증번호 문자 전송
    // 🚨✅ coolsms.default is not a constructor
    const messageService = coolsms();
    messageService.setSignature(
      process.env.COOLSMS_API_KEY,
      process.env.COOLSMS_API_SECRET
    );

    try {
      await messageService.sendOne({
        to: phoneNumber,
        from: process.env.COOLSMS_SENDER, // 사전에 등록된 발신번호 (010-xxxx-xxxx)
        text: `[유랑마켓] 인증번호는 ${verificationCode} 입니다.`,
      });

      // ❌ 2. 인증번호 임시 저장 (3분 후 만료) ❌
      // codeStore.set(phoneNumber, {
      //   code: verificationCode,
      //   expiresAt: Date.now() + 3 * 60 * 1000,
      // });

      // 2. Redis에 인증번호 저장 (⏰ 만료 시간 180초)
      //  Redis는 "만료된 키"를 자동으로 삭제하니까 Redis는 TTL 내장 기능 덕분에 아주 깔끔하게 처리 가능.
      await redis.set(phoneNumber, verificationCode, { ex: 180 });

      return res.status(200).json({ message: "인증번호 전송 완료" });
    } catch (error) {
      console.error("SMS 전송 실패:", error);
      return res.status(500).json({ error: "문자 전송 실패" });
    }
  }
}
