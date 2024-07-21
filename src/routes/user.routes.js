import { Router } from "express"
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser
} from "../controllers/user.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
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
router.route("/login").post(loginUser)

//secure routes
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/refresh").get(verifyJWT, refreshAccessToken)

export default router
