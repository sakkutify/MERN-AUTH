import User from "../models/userModel.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/errors.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import { isValidEmail } from "../utils/validEmail.js"
import mongoose from "mongoose"
import { welcomeEmail } from "../emails/welcomeEmail.js"
import { sendMail } from "../emails/sendMail.js"

export const signupController = async (req, res, next) => {
  let { name, email, password } = req.body

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"))
  }
  email = email.toString(email).trim().toLowerCase()
  password = password.toString().trim()

  if (email.includes(" ") || password.includes(" ")) {
    return next(
      errorHandler(400, "Email and password should not contain whitespace")
    )
  }

  if (!isValidEmail(email)) {
    return next(errorHandler(400, "Enter a valid email"))
  }

  try {
    // check for existing user
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return next(
        errorHandler(409, "Email already registered, sign in instead")
      )
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })
    //saving the new user
    newUser._id = new mongoose.Types.ObjectId()
    const response = await newUser.save()
    await sendMail(
      newUser.email,
      `Namaste, a warm welcome to ${process.env.SITE_TITLE}`,
      welcomeEmail(newUser.email)
    )
    res.status(201).jsonResponse(true, 201, "Sign up successfull", response)
  } catch (error) {
    next(error)
  }
}

export const signinController = async (req, res, next) => {
  let { email, password } = req.body

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"))
  }

  email = email.toString().trim().toLowerCase()
  password = password.toString().trim()

  if (email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"))
  }

  if (email.includes(" ") || password.includes(" ")) {
    return next(
      errorHandler(400, "Email and password should not contain whitespace")
    )
  }

  if (!isValidEmail(email)) {
    return next(errorHandler(400, "Enter a valid email"))
  }

  try {
    // check for existing user
    const user = await User.findOne({ email })
    if (!user) {
      return next(errorHandler(404, "User does not exist"))
    }
    const isValidPassword = bcryptjs.compareSync(password, user.password)
    if (!isValidPassword) {
      return next(errorHandler(400, "Invalid credentials"))
    }
    //setting the token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    )

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    })
    const { password: passwordExtracted, ...userWithoutPassword } = user._doc
    res
      .status(200)
      .jsonResponse(
        true,
        200,
        "User signed in successfully",
        userWithoutPassword
      )
  } catch (error) {
    next(error)
  }
}

export const signoutController = async (req, res, next) => {
  try {
    res.clearCookie("auth_token")
    res.status(200).jsonResponse(true, 200, "User signed out successfully")
  } catch (error) {
    next(error)
  }
}

let lastForgotPasswordRequestTime = null

export const forgotPasswordController = async (req, res, next) => {
  if (
    lastForgotPasswordRequestTime &&
    new Date().getTime() - lastForgotPasswordRequestTime < 120000
  ) {
    return next(
      errorHandler(
        429,
        "Please wait for 2 minutes before making another request"
      )
    )
  }
  let { email } = req.body

  if (!email) {
    return next(errorHandler(400, "All fields are required"))
  }

  email = email.trim()

  if (!isValidEmail(email)) {
    return next(errorHandler(400, "Enter a valid email"))
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return next(errorHandler(404, "User does not exist"))
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY + user.password,
      {
        expiresIn: "15m",
      }
    )
    const encodedToken = Buffer.from(token).toString("base64")

    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password/${user._id}/${encodedToken}`
    const htmlBody = `<body>
    Hi ${user.email}, <br>
    We have received a request to reset your password. Follow the below <b>One-time link</b> to change your password. <br>
    ${resetUrl} <br>
    <hr>
    If you have not requested the link then please ignore this email. 
    <br>
    Cheers,<br>
    ${process.env.SITE_TITLE} Team
  </body>`

    try {
      await sendMail(
        user.email,
        `Reset password link | ${process.env.SITE_TITLE}`,
        htmlBody
      )
      lastForgotPasswordRequestTime = new Date().getTime()
      res
        .status(200)
        .jsonResponse(true, 200, "Password reset email sent successfully")
    } catch (error) {
      next(error)
    }
  } catch (error) {
    next(error)
  }
}

export const resetPasswordValidatorController = async (req, res, next) => {
  let { userId, token } = req.params

  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return next(errorHandler(404, "User does not exist"))
    }

    const secret = process.env.JWT_SECRET_KEY + user.password
    const decodedToken = Buffer.from(token, "base64").toString()
    jwt.verify(decodedToken, secret)
    res.status(200).jsonResponse(true, 200, "Request is valid")
  } catch (error) {
    next(error)
  }
}

export const resetPasswordController = async (req, res, next) => {
  let { userId, token } = req.params
  let { password } = req.body

  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return next(errorHandler(404, "User does not exist"))
    }
    const secret = process.env.JWT_SECRET_KEY + user.password
    const decodedToken = Buffer.from(token, "base64").toString()
    jwt.verify(decodedToken, secret)

    if (!password) {
      return next(errorHandler(400, "Enter the password"))
    }
    password = password.trim()
    if (password === "") {
      return next(errorHandler(400, "Password cannot be empty"))
    }
    if (password.includes(" ")) {
      return next(errorHandler(400, "Password cannot have whitespaces"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    user.password = hashedPassword
    user.save()
    res.status(200).jsonResponse(true, 200, "Password changed successfully")
  } catch (error) {
    next(error)
  }
}

export const checkAuthController = async (req, res, next) => {
  const token = req.cookies.auth_token
  if (!token) {
    return next(errorHandler(401, "You are logged out, sign in again"))
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "You are logged out, sign in again"))
    }
  })
  res.status(200).jsonResponse(true, 200, "Authorized")
}
