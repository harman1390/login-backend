import { FastifyInstance } from "fastify";
import {
  getOrdersHandler,
  getCheckoutAddressesHandler,
  checkoutNewHandler,
  getCartHandler,
  addCartHandler,
  updateCartHandler,
  deleteCartHandler
} from "./handler";

import {
  getOrdersSchema,
  getCheckoutAddressesSchema,
  checkoutNewSchema,
  getCartSchema,
  addCartItemSchema,
  updateCartItemSchema,
  deleteCartItemSchema
} from "./schema";

export default async function orderRoutes(fastify: FastifyInstance) {
  // Orders
  fastify.get("/", { schema: getOrdersSchema }, getOrdersHandler);

  // Addresses
  fastify.get("/address", { schema: getCheckoutAddressesSchema }, getCheckoutAddressesHandler);
  fastify.post("/new-address", { schema: checkoutNewSchema }, checkoutNewHandler);

  // Cart
  fastify.get("/cart", { schema: getCartSchema }, getCartHandler);
  fastify.post("/cart", { schema: addCartItemSchema }, addCartHandler);
  fastify.put("/cart/:id", { schema: updateCartItemSchema }, updateCartHandler);
  fastify.delete("/cart/:id", { schema: deleteCartItemSchema }, deleteCartHandler);
}
