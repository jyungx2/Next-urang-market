import { v2 as cloudinary } from "cloudinary"; // Cloudinary 라이브러리 import
import formidable from "formidable"; // 파일 업로드된 FormData를 파싱하기 위한 Node 전용 라이브러리 (FormData를 서버에서 처리하려면 multipart/form-data를 파싱해야 하므로 반드시 필요)

// 환경 변수 유효성 검사
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

// Cloudinary 설정 적용
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // ✅ Next.js API Routes는 기본적으로 JSON만 파싱하므로, multipart는 비활성화해야 수동 처리 가능 (multipart/form-data를 직접 파싱하지 않기 때문에 bodyParser를 꺼야 함)
  },
};

// ✅ 실제 API 요청 처리
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable(); // 새 FormData 파서 생성

  // multipart/form-data 파싱 시작
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing error" });
    }

    const file = files.file?.[0]; // 🔥 input name="file"로 전달된 파일(⭐️배열로 들어옴 = 인덱스 값 [0]으로 첫 번째 파일 꺼내기⭐️)

    // 🔍 왜 배열인가?
    // formidable은 input[type=file]에서 multiple을 쓰지 않아도, 내부적으로 files.file을 배열로 처리할 수 있습니다. (특히 최신 버전에서는 모든 파일 input을 일관성 있게 배열로 반환합니다.)
    // console.log("🗂️ file: ", file);
    console.log("🥅 filepath: ", file.filepath);

    if (!file) return res.status(400).json({ error: "파일 없음" });

    // Cloudinary에 업로드
    // 📌 err: 파싱 중 오류 발생 시 에러 객체
    // 📌 fields: 파일 이외의 일반 텍스트 필드(input, textarea, select) 등의 값들 (ex: 제목, 설명 등)

    // 📌 files: input type="file"로 업로드된 파일 객체들 => client-side 코드 내 formData.append('key', value)에서 보낼 때의 key 이름으로 files.['key'] 받아와야 한다! ex) files.file

    // 📌 file.filePath: Cloudinary가 직접 읽을 수 있는, Cloudinary로 업로드할 때 사용되는 로컬 임시 파일 경로 (Cloudinary는 로컬의 경로를 요구하므로 IncomingForm에서 추출한 filepath를 사용 => 이 경로의 파일을 읽어서 자체 서버로 업로드하기 때문에, 즉, Cloudinary에 저장되는 경로와는 무관하며, 내부적으로만 읽기 위해 쓰인다.)

    // 🔹 어떤 상황에서 등장?
    // formidable (또는 IncomingForm) 같은 라이브러리를 사용할 때, multipart/form-data로 업로드된 파일을 서버의 임시 폴더(로컬) 에 저장하고 그 저장된 로컬 경로를 가리키는 속성

    // 🔹 왜 이걸 써야 해?
    // Cloudinary는 uploader.upload()를 사용할 때, 서버사이드에서 파일 경로(path) 또는 base64 문자열처럼 읽을 수 있는 위치나 형식을 요구하기 때문에, 이미지 객체 자체(file)를 직접 업로드 불가❌ -> "파일 경로(로컬)"를 제공해야 Cloudinary가 해당 경로의 파일을 읽어 업로드할 수 있기 때문!
    // EX) cloudinary.uploader.upload(file); // ❌ 브라우저의 File 객체 → Node에서 못 읽음
    // ⚠️ 이미지 객체 자체는 클라이언트에서만 유효하고, Cloudinary는 서버 환경에서 로컬 디스크나 버퍼로 접근 가능한 경로를 요구

    // 📌 secure_url: 업로드 후에 브라우저가 접근할 수 있는 이미지 주소
    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "urang-market-products",
      });

      // 업로드 성공 시 secure_url 응답
      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Cloudinary 업로드 실패:", error);
      return res.status(500).json({ error: "Cloudinary 업로드 실패" });
    }
  });
}
