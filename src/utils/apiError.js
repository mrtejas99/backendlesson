class ApiError extends Error {
  constructor(
    statusCode,
    msg = "message not specified",
    errors = [],
    stackTrace = ""
  ) {
    super(this.message)
    this.data = null
    this.message = msg
    this.stack = stackTrace
    this.success = false
    this.errors = errors

    if (stackTrace) {
      this.statusCode = statusCode
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError
