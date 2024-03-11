import express from "express"
import { getAllPostsController } from "../controllers/postController.js"
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js"

const router = express.Router()

router.get("/", verifyToken, getAllPostsController)

export default router
