export const getOrdersSchema = {
    description: "Get all orders for the signed-in user",
    tags: ["Orders"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            order_id: { type: "number" },
            customer_id: { type: "number" },
            order_date: { type: "string" },
            total_amount: { type: "number" },
            payment_status: { type: "string" }
          }
        }
      }
    }
  };
  
  export const getCheckoutAddressesSchema = {
    description: "Get all saved addresses for the signed-in user",
    tags: ["Orders"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            full_name: { type: "string" },
            phone: { type: "string" },
            address_line1: { type: "string" },
            address_line2: { type: "string", nullable: true },
            city: { type: "string" },
            state: { type: "string" },
            postal_code: { type: "string" },
            country: { type: "string" },
            is_default: { type: "boolean" },
            created_at: { type: "string" }
          }
        }
      }
    }
  };
  
  export const checkoutNewSchema = {
    description: "Add a new address for checkout",
    tags: ["Orders"],
    body: {
      type: "object",
      required: ["full_name", "phone", "address_line1", "city", "state", "postal_code", "country"],
      properties: {
        full_name: { type: "string" },
        phone: { type: "string" },
        address_line1: { type: "string" },
        address_line2: { type: "string", nullable: true },
        city: { type: "string" },
        state: { type: "string" },
        postal_code: { type: "string" },
        country: { type: "string" },
        is_default: { type: "boolean", default: false }
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
          address_id: { type: "number" }
        }
      }
    }
  };
  
  // ---------------- Cart Schemas ----------------
  export const getCartSchema = {
    description: "Fetch signed-in user's cart",
    tags: ["Cart"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            product_id: { type: "number" },
            product_name: { type: "string" },
            quantity: { type: "number" },
            sku_no: { type: "string" },
            category: { type: "number" },
            created_at: { type: "string" }
          }
        }
      }
    }
  };
  
  export const addCartItemSchema = {
    description: "Add product to cart",
    tags: ["Cart"],
    body: {
      type: "object",
      required: ["product_id", "product_name", "quantity", "sku_no", "category"],
      properties: {
        product_id: { type: "number" },
        product_name: { type: "string" },
        quantity: { type: "number", minimum: 1 },
        sku_no: { type: "string" },
        category: { type: "number" }
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
          cart_id: { type: "number" }
        }
      }
    }
  };
  
  export const updateCartItemSchema = {
    description: "Update cart item quantity",
    tags: ["Cart"],
    body: {
      type: "object",
      required: ["quantity"],
      properties: {
        quantity: { type: "number", minimum: 1 }
      }
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  };
  
  export const deleteCartItemSchema = {
    description: "Remove item from cart",
    tags: ["Cart"],
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  };
  