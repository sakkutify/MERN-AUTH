import User from "../models/userModel.js"
import { UNAUTHORIZED_MESSAGE } from "../utils/constants.js"
import { errorHandler } from "../utils/errors.js"
import { isValidEmail } from "../utils/validEmail.js"
import bcryptjs from "bcryptjs"

export const getUserController = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }
    const { password, ...userWithoutPassword } = user._doc

    res
      .status(200)
      .jsonResponse(
        200,
        true,
        "Users retrieved successfully",
        userWithoutPassword
      )
  } catch (error) {
    next(error)
  }
}

export const updateUserController = async (req, res, next) => {
  const userId = req.params.userId
  if (userId !== req.user.id) {
    return next(errorHandler(401, UNAUTHORIZED_MESSAGE))
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"))
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10)
  }

  if (req.body.email) {
    if (req.body.email.includes(" ")) {
      return next(errorHandler(400, "Email cannot contain spaces"))
    }
    if (!isValidEmail(req.body.email)) {
      return next(errorHandler(400, "Enter a valid email"))
    }
  }

  if (req.body.imgUrl) {
    if (req.body.imgUrl.includes(" ")) {
      return next(errorHandler(400, "Image address is not valid"))
    }
  }

  if (req.body.name) {
    req.body.name = req.body.name.trim()
    if (req.body.name === "") {
      return next(errorHandler(400, "Name is a required field"))
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          imgUrl: req.body.imgUrl,
          password: req.body.password,
        },
      },
      {
        new: true, // this will send the updated information otherwise it will return prev/old information
      }
    )

    const { password, ...updatedUserWithoutPassword } = updatedUser._doc
    res
      .status(200)
      .jsonResponse(
        true,
        200,
        "Profile updated successfully",
        updatedUserWithoutPassword
      )
  } catch (error) {
    next(error)
  }
}

export const deleteUserController = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const userFromDatabase = await User.findById(userId)
    if (!userFromDatabase) {
      res.status(404).jsonResponse(false, 404, "User not found")
    } else {
      if (userId === req.user.id) {
        await userFromDatabase.deleteOne()
        res.clearCookie("auth_token")
        res.status(200).jsonResponse(true, 204, "User deleted successfully")
      } else {
        return next(errorHandler(401, UNAUTHORIZED_MESSAGE))
      }
    }
  } catch (error) {
    next(error)
  }
}
