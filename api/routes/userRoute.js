import express from "express"
import {
  deleteUserController,
  updateUserController,
  getUserController,
} from "../controllers/userController.js"
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js"
import checkObjectIdParamMiddleware from "../middlewares/checkObjectIdParamMiddleware.js"

const router = express.Router()

router.get("/:userId", checkObjectIdParamMiddleware, getUserController)
router.put(
  "/:userId",
  checkObjectIdParamMiddleware,
  verifyToken,
  updateUserController
)
router.delete(
  "/:userId",
  checkObjectIdParamMiddleware,
  verifyToken,
  deleteUserController
)

export default router
