const [key, value] = [Symbol(), 'NetworkError'];

export default class NetworkError extends Error {
  constructor(message) {
    super(message);

    this.name = 'NetworkError';
    this.message = message || 'Network Error';

    // this is for checking isNetworkError
    this[key] = value;
  }
  static isNetworkError(err) {
    return err[key] === value;
  }
}
