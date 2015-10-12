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

    // extract necessary fetchOptions from config
    // https://fetch.spec.whatwg.org/#requestinit
    let extracts = [
      'method',
      'headers',
      'body',
      'referrer',
      'mode',
      'credentials',
      'cache',
      'redirect',
      'integrity',
      'window'
    ];
    let fetchOptions = {};
    extracts.map(key => {
      if (typeof config[key] !== 'undefined') fetchOptions[key] = config[key];
    });

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
