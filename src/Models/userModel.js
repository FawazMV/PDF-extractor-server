import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: value => {
          return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/.test(
            value
          )
        },
        message: 'Invalid email format'
      }
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  const saltRounds = 10
  const hash = await bcrypt.hash(user.password, saltRounds)
  user.password = hash
  next()
})

const UserModel = mongoose.model('user', userSchema)

export default UserModel
