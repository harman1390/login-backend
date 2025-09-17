// ---------------- Wishlist ----------------
export const getWishlistSchema = {
    description: "Fetch signed-in user's wishlist",
    tags: ["Wishlist"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            product_id: { type: "number" },
            product_name: { type: "string" },
            sku_no: { type: "string" },
            category: { type: "number" },
            created_at: { type: "string" }
          }
        }
      }
    }
  };
  
  export const addWishlistSchema = {
    description: "Add product to wishlist",
    tags: ["Wishlist"],
    body: {
      type: "object",
      required: ["product_id", "product_name", "sku_no", "category"],
      properties: {
        product_id: { type: "number" },
        product_name: { type: "string" },
        sku_no: { type: "string" },
        category: { type: "number" }
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
          wishlist_id: { type: "number" }
        }
      }
    }
  };
  
  export const deleteWishlistSchema = {
    description: "Remove product from wishlist",
    tags: ["Wishlist"],
    params: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "number" } }
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
  
  // ---------------- Reviews ----------------
  export const getReviewsSchema = {
    description: "Fetch reviews for a product",
    tags: ["Reviews"],
    params: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "number" } }
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            product_id: { type: "number" },
            user_id: { type: "number" },
            username: { type: "string" },
            rating: { type: "number" },
            comment: { type: "string" },
            created_at: { type: "string" }
          }
        }
      }
    }
  };
  
  export const addReviewSchema = {
    description: "Add a review for a product",
    tags: ["Reviews"],
    params: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "number" } }
    },
    body: {
      type: "object",
      required: ["rating", "comment"],
      properties: {
        rating: { type: "number", minimum: 1, maximum: 5 },
        comment: { type: "string" }
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
          review_id: { type: "number" }
        }
      }
    }
  };
  