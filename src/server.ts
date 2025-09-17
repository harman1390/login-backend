import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import path from "path";
import dotenv from "dotenv";
import fs from "fs/promises";

// Routes
import loginRoutes from "./routes/login";
import ordersRoutes from "./routes/orders";
import salesRoutes from "./routes/sales";
import stockRoutes from "./routes/stock";
import trackingRoutes from "./routes/tracking";
import feedbackRoutes from "./routes/feedback";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const NODE_ENV = process.env.NODE_ENV || "development";
const UPLOAD_PATH =
  process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, "uploads");

const fastify = Fastify({
  logger: true,
});

// ---------------- CORS (Allow all origins) ----------------
fastify.register(cors, {
  origin: true, // allow all origins
  credentials: true,
});

// ---------------- Swagger ----------------
fastify.register(swagger, {
  swagger: {
    info: {
      title: "Management API",
      description: "Fastify + MySQL + JWT",
      version: "1.0.0",
    },
    host:
      NODE_ENV === "production"
        ? "backend-testing123.up.railway.app"
        : `localhost:${PORT}`,
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

fastify.register(swaggerUi, {
  routePrefix: "/api-docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

// ---------------- File Upload & Static Serving ----------------
fastify.register(multipart);
fastify.register(staticPlugin, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

// ---------------- Routes ----------------
fastify.register(loginRoutes, { prefix: "/api/auth" });
fastify.register(ordersRoutes, { prefix: "/api/orders" });
fastify.register(salesRoutes, { prefix: "/api/sales" });
fastify.register(stockRoutes, { prefix: "/api/stock" });
fastify.register(trackingRoutes, { prefix: "/api/tracking" });
fastify.register(feedbackRoutes, { prefix: "/api/feedback" });

// ---------------- Upload Endpoint Example ----------------
fastify.post("/api/stock/upload", async (req, reply) => {
  const file = await req.file();
  if (!file) {
    reply.code(400).send({ error: "No file uploaded" });
    return;
  }
  const uploadsDir = path.join(__dirname, "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const savePath = path.join(uploadsDir, file.filename);
  const buffer = await file.toBuffer();
  await fs.writeFile(savePath, buffer);
  return {
    message: "File uploaded successfully",
    url: `/uploads/${file.filename}`,
  };
});

// ---------------- Root Route ----------------
fastify.get("/", async () => ({
  message: "Welcome to the Management API",
  environment: NODE_ENV,
  docs: "/api-docs",
  endpoints: {
    auth: "/api/auth",
    orders: "/api/orders",
    sales: "/api/sales",
    stock: "/api/stock",
    tracking: "/api/tracking",
    feedback: "/api/feedback",
  },
}));

// ---------------- Start Server ----------------
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running in ${NODE_ENV} mode`);
    console.log(`   - Local: http://localhost:${PORT}`);
    console.log(`   - Railway: https://backend-testing123.up.railway.app`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
