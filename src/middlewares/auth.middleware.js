import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import ApiError from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookie?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "")

    if (!accessToken) {
      throw new ApiError(401, "unauthorized request")
    }

    const decodedInfo = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SCERET)
    const user = await User.findById(decodedInfo?._id).toJSON()
    if (!user) {
      throw new ApiError(401, "invalid access token")
    }

    req.user = user
    next()
  } catch (error) {
    throw ApiError(401, error?.message)
  }
})
export default verifyJWT
