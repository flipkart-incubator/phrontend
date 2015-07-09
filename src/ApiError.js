class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.message = message || 'Error in API';
    this.statusCode = status;
    this.response = response;
  }
}

ApiError.isApiError = function(err) {
  return err instanceof ApiError;
};

export default ApiError;
