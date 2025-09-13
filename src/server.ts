import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerSchemas } from "./login/schema";
import authRouter from "./login";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration
const allowedOrigins = [
  'http://localhost:8080',
  'https://login-backend-production-ef54.up.railway.app'
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Login API",
      version: "1.0.0",
      description: "Simple Login & Signup API with MySQL + Express + TypeScript"
    },
    servers: [
      {
        url: NODE_ENV === 'production' 
          ? 'https://login-backend-production-ef54.up.railway.app' 
          : `http://localhost:${PORT}`,
        description: NODE_ENV === 'production' ? 'Production' : 'Development'
      }
    ],
    components: {
      schemas: swaggerSchemas
    }
  },
  apis: ["./src/login/*.ts"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Login API",
    environment: NODE_ENV,
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login"
    },
    docs: "/api-docs"
  });
});

// API Routes
app.use("/api", authRouter);

// Swagger UI
app.use("/api-docs", 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  const address = server.address();
  const host = typeof address === 'string' ? address : 
    `${address?.address === '::' ? 'localhost' : address?.address}:${address?.port}`;
    
  console.log(`🚀 Server running in ${NODE_ENV} mode`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Network: http://${host}`);
  console.log(`   - Railway: https://login-backend-production-ef54.up.railway.app`);
  console.log(`\n📚 API Documentation:`);
  console.log(`   - Local: http://localhost:${PORT}/api-docs`);
  console.log(`   - Railway: https://login-backend-production-ef54.up.railway.app/api-docs`);
});
