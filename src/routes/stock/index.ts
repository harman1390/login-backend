import { FastifyPluginAsync } from "fastify";
import { addStockHandler, getStockHandler } from "./handler";
import { addStockSchema, getStockSchema } from "./schema";

const stockRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /stock → add product (owner only)
  fastify.post("/stock", { schema: addStockSchema }, addStockHandler);

  // GET /stock → fetch all stock grouped by category
  fastify.get("/stock", { schema: getStockSchema }, getStockHandler);
};

export default stockRoutes;
