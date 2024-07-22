import { Router } from "express"
import multer from "multer"
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateCoverImg,
  updateUserAvatar
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

//secure routes, verifyJWT will give access to user object in req
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/refresh").get(verifyJWT, refreshAccessToken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-user").post(verifyJWT, updateAccountDetails)
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar)
router
  .route("/update-coverImg")
  .post(verifyJWT, upload.single("coverImg"), updateCoverImg)
export default router
