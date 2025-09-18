import { FastifyPluginAsync } from "fastify";
import {
  addStockHandler,
  getStockHandler,
  searchStockHandler
} from "./handler";
import {
  addStockSchema,
  getStockSchema,
  searchStockSchema
} from "./schema";

const stockRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /stock → add product (owner only)
  fastify.post("/stock", { schema: addStockSchema }, addStockHandler);

  // GET /stock → fetch all stock grouped by category
  fastify.get("/stock", { schema: getStockSchema }, getStockHandler);

  // GET /stock/search → search stock by name (case-insensitive)
  fastify.get("/stock/search", { schema: searchStockSchema }, searchStockHandler);
};

export default stockRoutes;
