import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

export const getTrackingHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  await authenticate(req, reply);

  const [rows] = await pool.query(
    "SELECT * FROM tracking"
  );

  return reply.code(200).send(rows);
};
