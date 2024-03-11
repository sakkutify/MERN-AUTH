import { isValidObjectId } from "mongoose"
import { errorHandler } from "../utils/errors.js"

const checkObjectIdParamMiddleware = (req, res, next) => {
  const params = req.params
  if (params && Object.keys(params).length > 0) {
    for (const key in params) {
      if (!isValidObjectId(params[key])) {
        return next(errorHandler(404, "Resource not found"))
      }
    }
  }

  next()
}

export default checkObjectIdParamMiddleware
