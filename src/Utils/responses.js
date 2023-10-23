// Function to send a response for missing input data
export const missingResponse = res => {
  res.status(400).json({ message: 'Missing email or password' })
}

// Function to send a success response with optional data
export const successResponse = (res, data) => {
  res.status(200).json({ success: true, ...data })
}

// Function to send an error response with a status code and message
export const errResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message })
}
