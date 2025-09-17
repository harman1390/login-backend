import { FastifyInstance } from "fastify";
import { getTrackingHandler } from "./handler";
import { trackingSchema } from "./schema";

export default async function trackingRoutes(fastify: FastifyInstance) {
  fastify.get("/tracking", { schema: trackingSchema }, getTrackingHandler);
}
