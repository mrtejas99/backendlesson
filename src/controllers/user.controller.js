import User from "../models/user.model.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import uploadFile from "../utils/fileUpload.js"

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

export default registerUser
