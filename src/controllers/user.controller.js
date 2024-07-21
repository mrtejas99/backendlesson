import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import uploadFile from "../utils/fileUpload.js"

const OPTIONS = { httpOnly: true, secure: true }

const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    user.accessToken = accessToken

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "token generation failed")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  //get user details from req
  //validation
  //check if user exists
  //is profilepic*, coverimg available, if yes, upload to cloudinary
  //get img url for profilepic
  //if not exists, create user object and save
  //strip password, refresh token and send obj as res if user created
  const { username, email, fullName, password } = req.body

  if (fullName?.trim() === "") throw new ApiError(400, "fullname is blank")
  if (email?.trim() === "") throw new ApiError(400, "email is blank")
  if (username?.trim() === "") throw new ApiError(400, "username is blank")
  if (password?.trim() === "") throw new ApiError(400, "password is blank")

  const existingUser = await User.findOne({ $or: [{ username }, { email }] })
  if (existingUser) throw new ApiError(409, "user already exists")

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  if (!avatarLocalPath) throw new ApiError(400, "avatar is required")
  const avatar = await uploadFile(avatarLocalPath)
  if (!avatar) throw new ApiError(400, "avatar is required")

  const coverImgLocalPath = req.files?.coverImg?.[0]?.path
  const coverImg = await uploadFile(coverImgLocalPath)
  const createdUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
    email,
    password,
    username
  })
  if (!createdUser) throw new ApiError(500, "user could not be saved in db")
  const userWithoutPassword = createdUser.toJSON()

  return res
    .status(201)
    .json(
      new ApiResponse(201, userWithoutPassword, "user added in db successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
  //get user details from req
  //validation
  //check if user exists
  //check creds
  //on check pass, generate access, request token
  //send the token in cookie
  console.log(req.body)
  const { email, username, password } = req.body
  if (!email && !username) {
    throw new ApiError(400, "username or email are required")
  }

  const user = await User.findOne({ $or: [{ email }, { username }] })
  if (!user) {
    throw new ApiError(404, "user does not exist")
  }

  const isPasswordMatch = await user.isPasswordCorrect(password)
  if (!isPasswordMatch) {
    throw new ApiError(401, "invalid credentials")
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user)

  const loggedInUser = user.toJSON()

  return res
    .status(200)
    .cookie("accessToken", accessToken, OPTIONS)
    .cookie("refreshToken", refreshToken, OPTIONS)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  //get user id
  //remove cookies
  //remove refreshToken from db
  //since verifyJWT middleware injects the user in the request, we can use it here

  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined }
  })

  return res
    .status(200)
    .clearCookie("accessToken", OPTIONS)
    .clearCookie("refreshToken", OPTIONS)
    .json(new ApiResponse(200, {}, "user logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "refresh token not present in request")
  }

  const decodedInfo = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN
  )
  const user = await User.findById(decodedInfo?._id)
  if (!user) {
    throw new ApiError(401, "invalid refresh token")
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "refresh token expired")
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user)

  return res
    .status(200)
    .cookie("accessToken", accessToken, OPTIONS)
    .cookie("refreshToken", refreshToken, OPTIONS)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "new tokens generated "
      )
    )
})

const changePassword = asyncHandler(async (req, res) => {
  //if user authenticated
  //read form data
  //check if same
  //update in db

  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "old password or new password not specified")
  }

  const user = await User.findById(req.user?._id)
  if (!user) {
    throw new ApiError("401", "user does not exist")
  }

  const isPasswordMatch = await user.isPasswordCorrect(oldPassword)
  if (!isPasswordMatch) {
    throw new ApiError(401, "invalid credentials")
  }
  user.password = password
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "passowrd changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user details"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body
  if (!fullName && !email) {
    throw new ApiError(400, "value cant be blank")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { email, fullName } },
    { new: true }
  )
  if (!user) {
    throw new ApiError(400, "updation of user info failed")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, user.toJSON, "user details updated successfully")
    )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails
}
