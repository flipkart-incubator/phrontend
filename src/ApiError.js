const [key, value] = [Symbol(), 'ApiError'];

export default class ApiError {
  constructor(message, status, response) {
    let err = new Error(message || 'Error in API');
    err.name = 'ApiError';
    err.statusCode = status;
    err.response = response;
    // this is for checking isApiError
    err[key] = value;
    return err;
  }
  static isApiError(err) {
    return err[key] === value
      && err instanceof Error;
  }
}
