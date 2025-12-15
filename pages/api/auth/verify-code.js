// import { verifyCode } from "./send-code"; // 같은 폴더에 있는 코드 재사용 => 🚨이건 독립된 실행 환경이라 codeStore를 공유하지 않음🚨
// ❌ codeStore는 send-code.js 내부에서만 유지되는 변수
// ❌ 다른 API route에서 import 하더라도 같은 메모리를 공유하지 않음
import redis from "@/lib/redis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phoneNumber, code } = req.body;
  console.log("verify-code: ", phoneNumber, code, typeof phoneNumber);

  // ❌ 삭제 코드
  // const success = verifyCode(phoneNumber, code);

  // ✅ Redis에서 해당 번호로 저장된 인증번호 가져오기
  // 🔥 Redis는 set할 때(send-code.js) "EX 180" 옵션을 줬기 때문에 180초(3분) 뒤에 자동으로 이 key가 삭제됨!
  // 따라서 유효 시간이 지났다면 get 결과는 null(= undefined)로 반환됨
  const storedCode = await redis.get(phoneNumber);
  const saved = String(storedCode ?? "").trim();
  const input = String(code ?? "").trim();

  if (!saved || saved !== input) {
    return res
      .status(400)
      .json({ error: "인증번호가 일치하지 않거나 만료되었습니다." });
  }

  // ✅ 인증 실패 조건: 저장된 값이 (만료돼서 or 처음부터) 없거나, 입력한 코드가 일치하지 않는 경우
  // if (!storedCode || storedCode !== code) {
  //   return res
  //     .status(400)
  //     .json({ error: "인증번호가 일치하지 않거나 만료되었습니다." });
  // }

  // ✅ 인증 성공 후 Redis에서 해당 key 삭제 (선택사항: 일회용 코드니까 지우는 게 좋음)
  await redis.del(phoneNumber);

  // TODO: 여기서 사용자 DB 확인 → 없으면 회원가입, 있으면 로그인 처리
  // 또는 next-auth credentials 방식으로 넘기기✅ (-> 여기서 db연결해서 FindOne으로 사용자 입력 기반 데이터를 가지고 기존 회원 여부 판단 => 로그인 or 회원가입 할 지 결정하는 중요한 순간!!)

  return res.status(200).json({ message: "인증 성공" });
}
