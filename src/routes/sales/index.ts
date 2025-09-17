import { FastifyInstance } from "fastify";
import { getSalesHandler } from "./handler";
import { getSalesSchema } from "./schema";

export default async function salesRoutes(fastify: FastifyInstance) {
  fastify.get("/sales", { schema: getSalesSchema }, getSalesHandler);
}
