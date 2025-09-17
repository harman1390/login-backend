import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
