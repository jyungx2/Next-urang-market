require("dotenv").config({ path: ".env.local" }); // ✅ .env.local 수동 로딩
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");

// .env 파일에서 MONGODB_URI, MONGODB_NAME이 설정되어 있다고 가정합니다.
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_NAME;
// CSV 파일 경로: scripts 폴더 내에 파일이 있음
const csvPath = path.join(__dirname, "국토교통부_전국법정동.csv");

const client = new MongoClient(MONGODB_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("locations");

    // 중복 실행 방지: 이미 데이터가 있으면 종료.
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log("🚫 데이터가 이미 존재합니다. 삽입을 건너뜁니다.");
      return;
    }

    const results = [];

    fs.createReadStream(csvPath)
      .pipe(iconv.decodeStream("euc-kr")) // EUC-KR → UTF-8 변환
      .pipe(csv())
      .on("data", (row) => {
        // console.log(row); // ✅ 삽입 데이터 확인용
        // CSV 헤더 이름은 실제 파일에 따라 다를 수 있습니다.
        // 여기서는 예시로 "법정동코드", "시도명", "시군구명", "읍면동명", "리명", "폐지여부"를 사용합니다.
        const doc = {
          code: row["법정동코드"]?.trim(),
          sido: row["시도명"]?.trim(),
          sigungu: row["시군구명"]?.trim(),
          eupmyeondong: row["읍면동명"]?.trim(),
          ri: row["리명"]?.trim() || "",
          // "폐지여부"가 "존재"이면 활성 데이터로 간주.
          isActive: !row["삭제일자"]?.trim(), // ✅ 삭제일자 없으면 사용 가능 주소
          // full 필드: 나중에 검색 편의를 위해 전체 주소 문자열 생성.
          full: `${row["시도명"]} ${row["시군구명"]} ${row["읍면동명"]} ${
            row["리명"] || ""
          }`.trim(),
        };
        results.push(doc);
      })
      .on("end", async () => {
        // 활성 데이터만 필터링
        const filtered = results.filter((doc) => doc.isActive);
        if (filtered.length > 0) {
          await collection.insertMany(filtered);
          console.log(`✅ 주소 데이터 삽입 완료 (${filtered.length}건)`);
        } else {
          console.log("🚫 활성 데이터가 없습니다.");
        }
        await client.close();
      });
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    await client.close();
  }
}

run();
