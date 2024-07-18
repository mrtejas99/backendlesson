import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

const app = express()

//middlewares
app.use(cors()) //allow cors
app.use(express.json({ limit: "16kb" })) //allow json input
app.use(express.urlencoded({ extended: true })) //allow querystring params
app.use(express.static("public")) //to store static files
app.use(cookieParser()) //allow cookie access, crud

//routes
import userRouter from "./routes/user.routes.js"
app.use("/api/users", userRouter)



export default app
