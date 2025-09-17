export const getSalesSchema = {
    description: "Get aggregated sales per product (owner only)",
    tags: ["Sales"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            product_name: { type: "string" },
            total_quantity: { type: "number" },
            total_sales: { type: "number" }
          }
        }
      }
    }
  };
  