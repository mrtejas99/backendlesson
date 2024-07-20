import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//if docs in a model are to be search by username, use index to optimise
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String,
      required: true
    },
    coverImg: {
      type: String
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
)

//hook to hash passowrd before storing
//'pre' and 'save' means run before saving
//avoid giving arrow function as handler as 'this' wont be there
//and here we need the 'this'
//'this' indicates from db
//crypto methods are time consuming, so mark it async
//since it is a middleware, it needs the 'next param
//note that the code is run every time, inserting new or updating existing
//to prevent rehashing password due to change in any attribute, use isModified
//pass the name of the attribute

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

//we are adding some custom 'hooks' which we want to use
//password is the one which is plaintext from user,
//'this.password' will have the encrypted one
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}
userSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.password
    delete ret.refreshToken
    return ret
  }
})
const User = mongoose.model("User", userSchema)

export default User
