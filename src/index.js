import express from "express";
import path from "path";
import { json } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./Routes/authRoutes.js";
import pdfRoutes from "./Routes/PDFRoutes.js";
import connectDb from "../Config/databaseConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON and handling CORS
app.use(json(), cors());

// API routes
app.use("/auth", auth);
app.use("/pdf", pdfRoutes);

// Serve static files
const currentFilePath = fileURLToPath(import.meta.url);
const currentPath = dirname(currentFilePath);

app.use("/uploads", express.static(path.join(currentPath, "../public/uploads/")));

// Health check route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error
  console.error(err.message);

  // Send an error response with a standardized format
  res.status(500).json({
    message: err.errorMessage || "Internal Server Error",
    error: err.message,
  });
});

// Establish a database connection and start the Express server
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
  });
});
