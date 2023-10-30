import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";
import { deleteFile, pdfNameGenerator } from "../Utils/helper.js";
import { authCheck } from "../Middlewares/authMiddlewear.js";
import PDFModel from "../Models/pdfModel.js";
import * as response from "../Utils/responses.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

// Controller for uploading a PDF and creating a new one
export const extractController = async (req, res, next) => {
  try {
    let { selectedPages } = req.body;
    selectedPages = JSON.parse(selectedPages);
    const pdfBytes = req.file?.buffer;

    // Check if a PDF file is provided
    if (!pdfBytes) {
      return response.missingResponse(res);
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    const invalidPages = selectedPages.filter(
      (page) => page < 1 || page > totalPages
    );

    // Check if selected page numbers are out of range
    if (invalidPages.length > 0) {
      return response.errResponse(
        res,
        400,
        "Invalid page selection. Some page numbers are out of range."
      );
    }

    const newPdfDoc = await PDFDocument.create();

    //taking selected pages
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newPdfDoc.save();

    //setting new name for the pdf
    const name = pdfNameGenerator(req.file.originalname);
    const newPdfPath = `newPDF/${name}.pdf`;

    await fs.writeFile("public/uploads/" + newPdfPath, newPdfBytes);

    //checking the user is logged in or not
    const authenticated = authCheck(req);

    if (authenticated) {
      // if the user is registered, save the document details in the database.
      const user = await PDFModel.findOne({ user: authenticated });
      if (!user) {
        const newOne = new PDFModel({
          user: authenticated,
          pdf: [{ name, path: process.env.SERVER_URL + "uploads/" + newPdfPath }],
        });
        await newOne.save();
      } else {
        await PDFModel.updateOne(
          { user: authenticated },
          {
            $push: {
              pdf: { name, path: process.env.SERVER_URL + "uploads/" + newPdfPath },
            },
          }
        );
      }
    } else {
      // if the user is not registered, delete the PDF after a certain time.
      deleteFile(newPdfPath);
    }

    //sending success response with url to the new pdf
    response.successResponse(res, {
      newPath: process.env.SERVER_URL + "uploads/" + newPdfPath,
    });
  } catch (error) {
    error.errorMessage = "Failed to create a new PDF";
    next(error);
  }
};

// Controller for getting all saved PDFs of user
export const getSavedPdfController = async (req, res, next) => {
  try {
    const [pdfs, user] = await Promise.all([
      PDFModel.findOne({ user: req.user }),
      UserModel.findById(req.user),
    ]);

    if (!user) {
      return response.errResponse(res, 404, "User not found");
    }

    response.successResponse(res, { pdfs: pdfs?.pdf || [] });
  } catch (error) {
    next(error);
  }
};
