const [key, value] = [Symbol(), 'NetworkError'];

export default class NetworkError {
  constructor(message) {
    let err = new Error(message || 'Network Error');
    err.name = 'NetworkError';
    // this is for checking isNetworkError
    err[key] = value;
    return err;
  }
  static isNetworkError(err) {
    return err[key] === value
      && err instanceof Error;
  }
}
