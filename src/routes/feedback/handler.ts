import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

// ---------------- Wishlist ----------------
export const getWishlistHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;

  const [rows] = await pool.query(
    "SELECT * FROM wishlist WHERE user_id = ?",
    [user.id]
  );

  return reply.code(200).send(rows);
};

export const addWishlistHandler = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const { product_id, product_name, sku_no, category } = req.body;

  const [result]: any = await pool.query(
    "INSERT INTO wishlist (user_id, product_id, product_name, sku_no, category) VALUES (?, ?, ?, ?, ?)",
    [user.id, product_id, product_name, sku_no, category]
  );

  return reply.code(201).send({ message: "Product added to wishlist", wishlist_id: result.insertId });
};

export const deleteWishlistHandler = async (req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const { id } = req.params;

  await pool.query("DELETE FROM wishlist WHERE id = ? AND user_id = ?", [id, user.id]);

  return reply.code(200).send({ message: "Product removed from wishlist" });
};

// ---------------- Reviews ----------------
export const getReviewsHandler = async (req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `SELECT r.id, r.product_id, r.user_id, u.username, r.rating, r.comment, r.created_at
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?`,
    [id]
  );

  return reply.code(200).send(rows);
};

export const addReviewHandler = async (req: FastifyRequest<{ Params: { id: number }; Body: { rating: number; comment: string } }>, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const { id } = req.params;
  const { rating, comment } = req.body;

  const [result]: any = await pool.query(
    "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    [id, user.id, rating, comment]
  );

  return reply.code(201).send({ message: "Review added", review_id: result.insertId });
};
