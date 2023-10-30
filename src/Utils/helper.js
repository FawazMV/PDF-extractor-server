import fs from "fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Compare a plain password with a hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    // Use bcrypt.compare to check for password match
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    return false; // Return false on error
  }
};

// Generate a JWT for a user that expires in 7 days
export const generateAuthToken = (user) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const payload = { email: user.email, _id: user._id };

  const expiration = "7d";

  // Create and sign the token
  const token = jwt.sign(payload, secretKey, { expiresIn: expiration });

  return token;
};

// Function to generate a unique name for a PDF
export const pdfNameGenerator = (filename) => {
  const timestamp = Date.now(); // Get the current timestamp
  const filenameHex = Buffer.from(filename, "utf-8").toString("hex"); // Convert the filename to hexadecimal
  return `${filenameHex + timestamp}`;
};

// Function to delete a file after a specified time
export const deleteFile = (pdfPath) => {
  setTimeout(async () => {
    try {
      await fs.unlink("public/uploads/" + pdfPath);
      console.log(`Deleted file: ${pdfPath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${pdfPath}`, error);
    }
  }, 3600000); // 3600000 milliseconds = 1 hour
};
