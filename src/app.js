import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

const app = express()

app.use(cors()) //allow cors
app.use(express.json({ limit: "16kb" })) //allow json input
app.use(express.urlencoded({ extended: true })) //allow querystring params
app.use(express.static("public")) //to store static files
app.use(cookieParser()) //allow cookie access, crud

export default app
