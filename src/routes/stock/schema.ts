export const addStockSchema = {
    description: "Add a product to stock (owner only)",
    tags: ["Stock"],
    body: {
      type: "object",
      required: ["product_name", "sku_no", "quantity", "category"],
      properties: {
        product_name: { type: "string" },
        sku_no: { type: "string" },
        quantity: { type: "number" },
        category: { type: "number" },
        picture: { type: "string", format: "uri", nullable: true }
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  };
  
  export const getStockSchema = {
    description: "Get all stock items grouped by category",
    tags: ["Stock"],
    response: {
      200: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              product_name: { type: "string" },
              sku_no: { type: "string" },
              quantity: { type: "string" },
              category: { type: "number" },
              picture: { type: "string", nullable: true }
            }
          }
        }
      }
    }
  };
  