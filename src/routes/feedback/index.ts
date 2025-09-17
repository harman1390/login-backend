import { FastifyInstance } from "fastify";
import {
  getWishlistHandler,
  addWishlistHandler,
  deleteWishlistHandler,
  getReviewsHandler,
  addReviewHandler
} from "./handler";

import {
  getWishlistSchema,
  addWishlistSchema,
  deleteWishlistSchema,
  getReviewsSchema,
  addReviewSchema
} from "./schema";

export default async function feedbackRoutes(fastify: FastifyInstance) {
  // Wishlist
  fastify.get("/wishlist", { schema: getWishlistSchema }, getWishlistHandler);
  fastify.post("/wishlist", { schema: addWishlistSchema }, addWishlistHandler);
  fastify.delete("/wishlist/:id", { schema: deleteWishlistSchema }, deleteWishlistHandler);

  // Reviews
  fastify.get("/products/:id/reviews", { schema: getReviewsSchema }, getReviewsHandler);
  fastify.post("/products/:id/reviews", { schema: addReviewSchema }, addReviewHandler);
}
