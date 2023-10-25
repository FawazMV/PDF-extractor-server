import { Router } from "express";
import upload from "../Middlewares/multer.js";
import * as controller from "../Controllers/pdfController.js";
import authVerify from "../Middlewares/authMiddlewear.js";

const router = Router();

router.post("/extract-pdf", upload.single("pdfFile"), controller.extractController);

router.get("/saved-pdfs", authVerify, controller.getSavedPdfController);

export default router;
