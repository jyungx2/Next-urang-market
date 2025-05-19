import {
  connectDatabase,
  getAllDocuments,
  insertDocument,
} from "../../../helpers/db-util";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // POST HTTP
  if (req.method === "POST") {
    const {
      writer,
      productImage,
      title,
      type,
      price,
      description,
      location,
      rcode,
      placeName,
    } = req.body;
    console.log(req.query);

    // Validation for server-side
    if (
      !writer ||
      !productImage ||
      !title ||
      !type ||
      !price ||
      !description ||
      !location ||
      !rcode ||
      !placeName
    ) {
      res.status(422).json({ message: "Invalid input - post" });
      client.close();
      return;
    }

    const newProduct = {
      writer,
      productImage,
      title,
      type,
      description,
      price,
      location,
      rcode,
      createdAt: new Date(),
      placeName,
    };

    let result;
    try {
      result = await insertDocument(client, "products", newProduct);
      newProduct._id = result.insertedId;
      res
        .status(201)
        .json({ message: "Added product in market page", product: newProduct });
    } catch (err) {
      res.status(500).json({ message: "Inserting post failed!" });
    }
  }

  // GET HTTP
  if (req.method === "GET") {
    const { rcode } = req.query;

    const filter = { rcode };

    try {
      const documents = await getAllDocuments(
        client,
        "products",
        { _id: -1 },
        filter
      );
      res.status(200).json({ products: documents });
    } catch (err) {
      res.status(500).json({ message: "Getting posts failed!" });
    }
  }

  client.close();
  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
