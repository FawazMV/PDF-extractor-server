import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    console.log('Connected to the database')
  } catch (err) {
    console.error('Database connection error:', err.message)
  }

  // Handle connection events (optional)
  const db = mongoose.connection
  db.on('error', err => console.error('MongoDB connection error:', err))
  db.once('open', () => console.log('MongoDB connected.'))
  db.on('disconnected', () => console.log('MongoDB disconnected.'))

  // Handle graceful shutdown (e.g., when your application exits)
  process.on('SIGINT', () => {
    db.close(() => {
      console.log('MongoDB connection closed.')
      process.exit(0)
    })
  })
}

export default connectDb
