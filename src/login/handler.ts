import { Request, Response } from "express";
import { pool } from "../db";

// Signup
export const signupHandler = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save password as plain text
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email or username already exists" });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Login
export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    // Compare plain-text directly
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
