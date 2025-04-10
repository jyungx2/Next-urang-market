import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // 👈 body 크기 제한 상향
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "이미지가 없습니다." });

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "urang-market-profileImages",
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("업로드 실패:", error);
    return res.status(500).json({ error: "이미지 업로드 실패" });
  }
}

// export async function uploadImage(image) {
//   const imageData = await image.arrayBuffer();
//   const mime = image.type;
//   const encoding = "base64";
//   const base64Data = Buffer.from(imageData).toString("base64");
//   const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
//   const result = await cloudinary.uploader.upload(fileUri, {
//     folder: "urang-market-profileImages",
//   });
//   return result.secure_url;
// }
