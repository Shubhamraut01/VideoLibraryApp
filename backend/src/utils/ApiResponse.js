class ApiResponse {
  constructor(success, data, message = "Success") {
    this.statusCode = this.statusCode;
    this.success = success < 400;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
