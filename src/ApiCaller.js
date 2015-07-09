import NetworkError from './NetworkError';
import url from 'url';

class ApiCaller {
  get(config) {
    config.method = 'GET';
    return this._request(config, null);
  }

  post(config, _reqBody) {
    config.method = 'POST';
    let reqBody = typeof _reqBody === 'string' ? _reqBody : JSON.stringify(_reqBody);
    return this._request(config, reqBody);
  }

  put(config, _reqBody) {
    config.method = 'PUT';
    let reqBody = typeof _reqBody === 'string' ? _reqBody : JSON.stringify(_reqBody);
    return this._request(config, reqBody);
  }

  delete(config) {
    config.method = 'DELETE';
    return this._request(config, null);
  }

  _request(config, reqBody) {
    const networkErrors = [
      'Failed to fetch',
      'Network request failed'
    ];

    let fetchOptions = {
      method: config.method,
      headers: config.headers
    };

    if (reqBody) {
      fetchOptions.body = reqBody;
    }

    return fetch(url.format(config), fetchOptions)
      .then(response => {
        return response;
      }, err => {
        if (err instanceof TypeError && networkErrors.indexOf(err.message) !== -1 ) {
          return Promise.reject(new NetworkError(err.message));
        }

        return Promise.reject(err);
      });
  }
}

export default new ApiCaller();
