import { FastifyInstance } from "fastify";
import { signupHandler, loginHandler } from "./handler";
import { signupSchema, loginSchema } from "./schema";

export default async function loginRoutes(app: FastifyInstance) {
  app.post("/signup", { schema: { body: signupSchema.body } }, signupHandler);
  app.post("/login", { schema: { body: loginSchema.body } }, loginHandler);
}
