import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

// PreHandler to check if user is owner
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
  picture?: string;
}

export const addStockHandler = async (req: FastifyRequest<{ Body: AddStockBody }>, reply: FastifyReply) => {
  await checkOwnerRole(req, reply);
  const { product_name, sku_no, quantity, category, picture } = req.body;

  await pool.query(
    "INSERT INTO stock (product_name, sku_no, quantity, category, picture) VALUES (?, ?, ?, ?, ?)",
    [product_name, sku_no, quantity, category, picture || null]
  );

  return reply.code(201).send({ message: "Product added to stock successfully" });
};

// ---------------- GET /stock ----------------
export const getStockHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await authenticate(req, reply); // all signed-in users

    const [rows] = await pool.query("SELECT * FROM stock");

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
