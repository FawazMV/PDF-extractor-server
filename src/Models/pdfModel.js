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
        name: String,
        path: String
      }
    ]
  },
  { timestamps: true }
)

const PDFModel = mongoose.model('pdf', pdfSchema)

export default PDFModel
