import jwt from 'jsonwebtoken'
import * as response from '../Utils/responses.js'

const authVerify = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token)
    return response.errResponse(
      res,
      401,
      'Authentication failed: No token provided.'
    )

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified // Attach the user object to the request for later use
    next()
  } catch (err) {
    return response.errResponse(
      res,
      401,
      'Authentication failed: Invalid token.'
    )
  }
}

export default authVerify
