import mongoose from 'mongoose'

const pdfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      unique: true
    },
    pdf: [
      {
        originalPDF: {
          name: {
            type: String,
            required: true
          },
          path: {
            type: String,
            required: true
          }
        },
        modifiedPDFs: [
          {
            name: String,
            path: String
          }
        ]
      }
    ]
  },
  { timestamps: true }
)

const PDFModel = mongoose.model('pdf', pdfSchema)

export default PDFModel
