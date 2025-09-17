import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

// ---------------- Orders ----------------
export const getOrdersHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;

  const [rows] = await pool.query(
    "SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC",
    [user.id]
  );

  return reply.code(200).send(rows);
};

// ---------------- Addresses ----------------
export const getCheckoutAddressesHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;

  const [rows] = await pool.query("SELECT * FROM address WHERE user_id = ?", [user.id]);
  return reply.code(200).send(rows);
};

interface CheckoutNewBody {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export const checkoutNewHandler = async (
  req: FastifyRequest<{ Body: CheckoutNewBody }>,
  reply: FastifyReply
) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const body = req.body;

  const [result]: any = await pool.query(
    `INSERT INTO address 
      (user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      body.full_name,
      body.phone,
      body.address_line1,
      body.address_line2 || null,
      body.city,
      body.state,
      body.postal_code,
      body.country,
      body.is_default ? 1 : 0
    ]
  );

  return reply.code(201).send({ message: "Address added successfully", address_id: result.insertId });
};

// ---------------- Cart ----------------
export const getCartHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);
  const user = (req as any).user;

  const [rows] = await pool.query(
    "SELECT * FROM cart WHERE user_id = ?",
    [user.id]
  );

  return reply.code(200).send(rows);
};

export const addCartHandler = async (
  req: FastifyRequest<{ Body: any }>,
  reply: FastifyReply
) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const body = req.body;

  const [result]: any = await pool.query(
    `INSERT INTO cart (user_id, product_id, product_name, quantity, sku_no, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      body.product_id,
      body.product_name,
      body.quantity,
      body.sku_no,
      body.category
    ]
  );

  return reply.code(201).send({ message: "Product added to cart", cart_id: result.insertId });
};

export const updateCartHandler = async (
  req: FastifyRequest<{ Body: { quantity: number }; Params: { id: number } }>,
  reply: FastifyReply
) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const { id } = req.params;
  const { quantity } = req.body;

  await pool.query(
    "UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, id, user.id]
  );

  return reply.code(200).send({ message: "Cart item updated" });
};

export const deleteCartHandler = async (
  req: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  await authenticate(req, reply);
  const user = (req as any).user;
  const { id } = req.params;

  await pool.query(
    "DELETE FROM cart WHERE id = ? AND user_id = ?",
    [id, user.id]
  );

  return reply.code(200).send({ message: "Cart item removed" });
};
