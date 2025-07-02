// pages/api/checkout.js
import { connectDatabase, getDocumentById } from "@/helpers/db-util";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "허용되지 않은 요청 방식입니다." });

  const { productId, buyerId } = req.body;
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  try {
    const product = await getDocumentById(client, "products", productId);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/market/${productId}/chat/success?productId=${productId}&buyerId=${buyerId}`,
      cancel_url: `${req.headers.origin}/market/${productId}/chat/cancel?productId=${productId}`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "💥 결제 세션 생성 중 오류" });
  }
  client.close();
}
