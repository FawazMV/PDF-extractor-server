import PDFModel from '../Models/pdfModel.js'
import UserModel from '../Models/userModel.js'
import * as helper from '../Utils/helper.js'
import * as response from '../Utils/responses.js'

// Login controller for user authentication
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check for missing email or password
    if (!email || !password) return response.missingResponse(res)

    // Find the user by email
    const user = await UserModel.findOne({ email: email })

    // Handle invalid email or password
    if (!user)
      return response.errResponse(res, 401, 'Invalid email or password')

    // Verify the password
    const passwordMatch = await helper.comparePassword(password, user.password)

    // Handle invalid password
    if (!passwordMatch)
      return response.errResponse(res, 401, 'Invalid email or password')

    // Generate a token for successful authentication
    const token = helper.generateAuthToken(user)

    // Send a success response with the token
    response.successResponse(res, { message: 'Signin successful', token })
  } catch (error) {
    // Handle any other errors by passing them to the next middleware
    next(error)
  }
}

// Signup controller for user registration
export const signupController = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check for missing email or password
    if (!email || !password) return response.missingResponse(res)

    // Check if the user with the provided email already exists
    const user = await UserModel.findOne({ email: email })
    if (user) return response.errResponse(res, 400, 'Email already registered')

    // Create a new user if not already registered
    const newUser = new UserModel({ email, password })
    await newUser.save()

    // Generate a token for successful registration
    const token = helper.generateAuthToken(newUser)

    // Send a success response with a message and the token
    response.successResponse(res, { message: 'Registration successful', token })
  } catch (error) {
    // Handle any other errors by passing them to the next middleware
    next(error)
  }
}

// Controller for deleting a user account
export const deleteAccountController = async (req, res, next) => {
  try {
    const userId = req.user._id // Get the user's ID from the request

    // Use Promise.all to perform parallel operations
    const [deletedUser, deletedPDFs] = await Promise.all([
      UserModel.findByIdAndRemove(userId), // Delete the user
      PDFModel.deleteOne({ user: userId }) // Delete associated PDFs
    ])

    // User not found, return an error response
    if (!deletedUser) return response.errResponse(res, 404, 'User not found')

    // Account deleted successfully, return a success response
    response.successResponse(res, { message: 'Account deleted successfully' })
  } catch (error) {
    // Handle any other errors by passing them to the next middleware
    next(error)
  }
}
