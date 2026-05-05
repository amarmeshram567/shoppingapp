import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShoppingApp Admin API",
      version: "1.0.0",
      description: "Production-oriented admin backend for ShoppingApp"
    },
    servers: [{ url: "/api" }]
  },
  apis: []
});
