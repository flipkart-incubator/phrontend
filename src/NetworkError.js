class NetworkError extends Error {
  constructor(message) {
    super(message);

    this.name = 'NetworkError';
    this.message = message || 'Network Error';
  }
}

NetworkError.isNetworkError = function(err) {
  return err instanceof NetworkError;
};

export default NetworkError;
