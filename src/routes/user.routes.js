import { Router } from "express"
import registerUser from "../controllers/user.controller.js"
import upload from "../middlewares/multer.middleware.js"

const router = Router()
//accepting two files: avatar and coverimg. keep name same in backend, frontend
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImg", maxCount: 1 }
  ]),
  registerUser
)

export default router
