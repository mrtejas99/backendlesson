import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/index.js"

dotenv.config({
  path: "../.env"
})

//As connectDB is an async method, it will return a promise
connectDB()
  .then(() => {
    const port = process.env.PORT || 8000
    app.listen(port, () => {
      console.log(`server listening on ${process.env.HOST}:${port}`)
    })
    app.on("error", (e) => {
      console.log(`App error: ${e}`)
    })
  })
  .catch((e) => console.error(`MongoDB failed in index.js ${e}`))
