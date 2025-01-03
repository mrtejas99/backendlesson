class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.data = data
    this.message = message
    this.statusCode = statusCode
    this.success = statusCode < 400 //only the successful ones
  }
}

export default ApiResponse
