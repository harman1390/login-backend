import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

const checkOwnerRole = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  if (user.roles !== "1") {
    return reply.code(403).send({ error: "Access denied" });
  }
};

export const getSalesHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  await checkOwnerRole(req, reply);

  const [rows] = await pool.query(
    `SELECT s.product_name, SUM(o.total_amount) AS total_sales, SUM(s.quantity) AS total_quantity
     FROM sales o
     JOIN stock s ON o.stock_id = s.id
     GROUP BY s.product_name`
  );

  return reply.code(200).send(rows);
};
