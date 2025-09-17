// Validation schemas for Fastify routes (AJV strict mode)
export const signupSchema = {
  body: {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      username: { type: "string", minLength: 3 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
};

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
};

// Swagger/OpenAPI examples (used only in docs, not for validation)
export const swaggerSchemas = {
  Signup: {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      username: { type: "string", example: "john_doe" },
      email: { type: "string", example: "john@example.com" },
      password: { type: "string", example: "mypassword123" },
    },
  },
  Login: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", example: "john@example.com" },
      password: { type: "string", example: "mypassword123" },
    },
  },
};
