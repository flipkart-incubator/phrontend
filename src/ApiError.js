const [key, value] = [Symbol(), 'ApiError'];

export default class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.message = message || 'Error in API';
    this.statusCode = status;
    this.response = response;
    // this is for checking isApiError
    this[key] = value;
  }
  static isApiError(err) {
    return err[key] === value;
  }
}
