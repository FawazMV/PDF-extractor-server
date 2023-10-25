import multer from 'multer'

// Configure multer to use memory storage
const storage = multer.memoryStorage()

// function to filter uploaded files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    // If the file is a PDF, accept it
    cb(null, true)
  } else {
    // If the file is not a PDF, reject it with an error message
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false)
  }
}

// Create a multer instance with the specified storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})

export default upload
