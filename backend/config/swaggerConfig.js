const swaggerAutogen = require("swagger-autogen")();

const doc = {
  swagger: "2.0",  
  info: {
    title: "Task-3 API",
    version: "1.0.0",
    description: "API documentation for my Node.js application",
  },
  host: "localhost:4000",  
  schemes: ["http"],  
};

const outputFile = "./swagger.json"; 
const endpointsFiles = [
  "./server.js",
  "./routes/authRoutes.js",
  "./routes/userRoute.js",
  "./routes/productRoute.js",
];

// Generate swagger.json and exit process
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Swagger documentation generated!");
  process.exit(); 
});
