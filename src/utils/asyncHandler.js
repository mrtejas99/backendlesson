//This is a higher order function that will take a function as parameter
//To be mostly used for handling requests, middleware
//next will be used in case of middleware to indicate if next to execute

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (e) {
    res.status(e.code || 500).json({
      success: false,
      message: e.message
    })
  }
}

export default asyncHandler
