// ---------------- Add Stock Schema ----------------
export const addStockSchema = {
  body: {
    type: "object",
    required: ["product_name", "sku_no", "quantity", "category"],
    properties: {
      product_name: { type: "string", minLength: 1 },
      sku_no: { type: "string", minLength: 1 },
      quantity: { type: "number", minimum: 0 },
      category: { type: "number" }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        picture: { type: "string" }
      }
    },
    403: {
      type: "object",
      properties: { error: { type: "string" } }
    },
    500: {
      type: "object",
      properties: { error: { type: "string" } }
    }
  }
};

// ---------------- Get Stock Schema ----------------
export const getStockSchema = {
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
            quantity: { type: "number" },
            category: { type: "number" },
            picture: { type: ["string", "null"] }
          }
        }
      }
    },
    500: {
      type: "object",
      properties: { error: { type: "string" } }
    }
  }
};

// ---------------- Search Stock Schema ----------------
export const searchStockSchema = {
  querystring: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        count: { type: "number" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              product_name: { type: "string" },
              sku_no: { type: "string" },
              quantity: { type: "number" },
              category: { type: "number" },
              picture: { type: ["string", "null"] }
            }
          }
        }
      }
    },
    400: {
      type: "object",
      properties: { error: { type: "string" } }
    },
    500: {
      type: "object",
      properties: { error: { type: "string" } }
    }
  }
};
