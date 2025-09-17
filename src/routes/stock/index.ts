import { FastifyInstance } from "fastify";
import { addStockHandler, getStockHandler } from "./handler";
import { addStockSchema, getStockSchema } from "./schema";

export default async function stockRoutes(fastify: FastifyInstance) {
  // Owner adds a new stock item
  fastify.post("/stock", { schema: addStockSchema }, addStockHandler);

  // All signed-in users can view stock items grouped by category
  fastify.get("/stock", { schema: getStockSchema }, getStockHandler);
}
