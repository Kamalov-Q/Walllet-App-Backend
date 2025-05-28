// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transactions API",
      version: "1.0.0",
      description: "API documentation for managing user transactions",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/transaction.route.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
