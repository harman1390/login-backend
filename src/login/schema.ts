export const signupSchema = {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      username: { type: "string", example: "john_doe" },
      email: { type: "string", format: "email", example: "john@example.com" },
      password: { type: "string", example: "mypassword123" },
    },
  };
  
  export const loginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "john@example.com" },
      password: { type: "string", example: "mypassword123" },
    },
  };
  
  export const swaggerSchemas = {
    Signup: signupSchema,
    Login: loginSchema,
  };
  