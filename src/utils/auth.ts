import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { FastifyReply, FastifyRequest } from "fastify";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Generate a JWT token (expires in 1 hour)
export const generateToken = (payload: { id: number; username: string; email: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // <- 1 hour
};

// Verify and decode a JWT token
export const verifyToken = (token: string): { id: number; username: string; email: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; email: string; iat: number; exp: number };
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

// Fastify pre-handler style authentication utility
export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.code(401).send({ error: "Missing or invalid Authorization header" });
    throw new Error("Unauthorized");
  }
  const token = authHeader.substring("Bearer ".length);
  try {
    const user = verifyToken(token);
    (req as any).user = user;
  } catch (e) {
    reply.code(401).send({ error: "Invalid or expired token" });
    throw e;
  }
};
