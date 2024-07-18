import multer from "multer"

//request will contain data in request example json
//file will have any uploaded files in the request
//callback takes first param as err, remaining is th path to store
//filename allows us to the the file after modifing it as per need
//originalname retains the original name of the file uploade by user

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/temp")
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    callback(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

export default upload
