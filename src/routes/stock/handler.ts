import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import { authenticate } from "../../utils/auth";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

// Path to uploads folder (Railway volume or local)
const UPLOAD_PATH = path.join(__dirname, "../../uploads");

// ---------------- PreHandler ----------------
// Check if user is an owner
const checkOwnerRole = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  if (user.roles !== "1") {
    return reply.code(403).send({ error: "Access denied" });
  }
};

// ---------------- POST /stock ----------------
interface AddStockBody {
  product_name: string;
  sku_no: string;
  quantity: number;
  category: number;
}

export const addStockHandler = async (
  req: FastifyRequest<{ Body: AddStockBody; Multipart: true }>,
  reply: FastifyReply
) => {
  await checkOwnerRole(req, reply);

  const { product_name, sku_no, quantity, category } = req.body;

  // Handle file upload
  let pictureUrl: string | null = null;
  try {
    const file = await req.file();
    if (file) {
      await fs.mkdir(UPLOAD_PATH, { recursive: true });
      const extension = path.extname(file.filename);
      const uniqueName = `${randomUUID()}${extension}`;
      const savePath = path.join(UPLOAD_PATH, uniqueName);
      const buffer = await file.toBuffer();
      await fs.writeFile(savePath, buffer);
      pictureUrl = `/uploads/${uniqueName}`;
    }
  } catch (err) {
    console.error("File upload error:", err);
    return reply.code(500).send({ error: "Failed to upload image" });
  }

  try {
    await pool.query(
      "INSERT INTO stock (product_name, sku_no, quantity, category, picture) VALUES (?, ?, ?, ?, ?)",
      [product_name, sku_no, quantity, category, pictureUrl]
    );

    return reply
      .code(201)
      .send({ message: "Product added to stock successfully", picture: pictureUrl });
  } catch (err) {
    console.error("Add stock error:", err);
    return reply.code(500).send({ error: "Failed to add product to stock" });
  }
};

// ---------------- GET /stock ----------------
export const getStockHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {

    const [rows] = await pool.query("SELECT * FROM stock");

    // Group by category
    const grouped: Record<string, any[]> = {};
    (rows as any[]).forEach((item) => {
      const category = item.category ?? "uncategorized";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });

    return reply.code(200).send(grouped);
  } catch (error) {
    console.error("Error fetching stock:", error);
    return reply.code(500).send({ error: "Failed to fetch stock" });
  }
};

// ---------------- GET /stock/search ----------------
export const searchStockHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {

    const { name } = req.query as { name?: string };

    if (!name) {
      return reply.code(400).send({ error: "Search term is required" });
    }

    // MySQL search (case-insensitive)
    const [rows] = await pool.query(
      "SELECT * FROM stock WHERE LOWER(product_name) LIKE LOWER(?)",
      [`%${name}%`]
    );

    return reply.code(200).send({
      success: true,
      count: (rows as any[]).length,
      data: rows,
    });
  } catch (error) {
    console.error("Error searching stock:", error);
    return reply.code(500).send({ error: "Failed to search stock" });
  }
};
