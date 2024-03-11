import express from "express"
import dotenv from "dotenv/config"
import userRouter from "./routes/userRoute.js"
import authRouter from "./routes/authRoute.js"
import postRouter from "./routes/postRoute.js"
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js"
import responseMiddleware from "./middlewares/responseMiddleware.js"
import connect from "./db/connect.js"
import { PORT } from "./utils/constants.js"
import cookieParser from "cookie-parser"
import path from "path"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"

const __dirname = path.resolve()
const app = express()
const globalLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour duration
  message: {
    statusCode: 429,
    success: false,
    message: "Too many requests, please try again later",
  },
})

// Middlewares ------>
app.use("/api", globalLimiter)
app.use(helmet())
app.use(mongoSanitize()) // sanitization againt NOSQL query injection
app.use(xss()) // sanitize agains XSS attacks (like HTML in input)
app.use(express.json({limit: "5mb"}))
app.use(cookieParser())
app.use(responseMiddleware)

// Routes middleware ------------------------------------>
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/posts", postRouter)

app.use(express.static(path.join(__dirname, "/client/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})

// Error hnadling middlewares------------------->
app.use(errorHandlerMiddleware)

// Server start code----------------------->
const start = async () => {
  try {
    await connect(process.env.MONGODB_CONNECTION_URI)
    console.log("MongoDB connected successfully")
    app.listen(PORT, () => {
      console.log("Server running at port:", PORT)
    })
  } catch (error) {
    console.log(error.message)
  }
}

start()
