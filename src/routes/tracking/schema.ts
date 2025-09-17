export const trackingSchema = {
    description: "Fetch tracking information",
    tags: ["Tracking"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tracking_id: { type: "number" },
            order_id: { type: "number" },
            status: { type: "string" },
            updated_at: { type: "string" }
          }
        }
      }
    }
  };
  