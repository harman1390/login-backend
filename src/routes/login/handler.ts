import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../../utils/db";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/auth";

interface SignupBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// ---------------- SIGNUP ----------------
export const signupHandler = async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return reply.code(400).send({ error: "Username, email and password are required." });
  }

  if (!email.includes("@")) {
    return reply.code(400).send({ error: "Invalid email format." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return reply.code(201).send({ message: "User registered successfully." });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return reply.code(409).send({ error: "Email already exists." });
    }
    console.error("Signup Error:", err);
    return reply.code(500).send({ error: "Internal server error." });
  }
};

// ---------------- LOGIN ----------------
export const loginHandler = async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return reply.code(400).send({ error: "Email and password are required." });
  }

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows || rows.length === 0) {
      return reply.code(401).send({ error: "Invalid email or password." });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(401).send({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, username: user.username, email: user.email });

    // Save token to tokens table (1 hour expiry)
    await pool.query(
      "INSERT INTO tokens (token, expires_at) VALUES (?, ?)",
      [token, new Date(Date.now() + 1000 * 60 * 60)] // <- 1 hour in milliseconds
    );

    return reply.code(200).send({
      message: "Login successful.",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return reply.code(500).send({ error: "Internal server error." });
  }
};
