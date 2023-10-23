import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Compare a plain password with a hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    return false // Return false on error
  }
}

// Generate a JWT for a user that expires in 7 days
export const generateAuthToken = user => {
  const secretKey = process.env.JWT_SECRET_KEY
  const payload = { email: user.email }

  const expiration = '7d'

  // Create and sign the token
  const token = jwt.sign(payload, secretKey, { expiresIn: expiration })

  return token
}
