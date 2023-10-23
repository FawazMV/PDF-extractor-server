import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import auth from './Routes/authRoutes.js'
import pdfRoutes from './Routes/PDFRoutes.js'
import connectDb from '../Config/databaseConfig.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware for parsing JSON and handling CORS
app.use(json(), cors())

// API routes
app.use('/auth', auth)
app.use('/pdf', pdfRoutes)

// Health check route
app.get('/', (req, res) => {
  res.send('Server is working')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

// Establish a database connection and start the Express server
connectDb().then(() => {
  app.listen(PORT || 8000, () => {
    console.log(`Server is running on port number ${PORT || 8000}`)
  })
})
