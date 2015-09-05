import './helpers/__prelude.js';
import ApiCaller from '../src/ApiCaller.js';
import NetworkError from '../src/NetworkError.js';

describe('ApiCaller', function() {
  it('.get() should make GET call without body', function(done) {
    ApiCaller.get({ hostname: 'flipkart.com/200/html' }, 'body')
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.method).to.equal('GET');
        expect(resp.body).to.equal(undefined);
        done();
      });
  });

  it('.post() should make POST call with body', function(done) {
    ApiCaller.post({ hostname: 'flipkart.com/200/html' }, 'body')
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.method).to.equal('POST');
        expect(resp.body).to.equal('body');
        done();
      });
  });

  it('.put() should make PUT call with body', function(done) {
    ApiCaller.put({ hostname: 'flipkart.com/200/html' }, 'body')
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.method).to.equal('PUT');
        expect(resp.body).to.equal('body');
        done();
      });
  });

  it('.delete() should make DELETE call', function(done) {
    ApiCaller.delete({ hostname: 'flipkart.com/200/html' }, 'body')
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.method).to.equal('DELETE');
        expect(resp.body).to.equal(undefined);
        done();
      });
  });

  it('.post() should stringify body data', function(done) {
    ApiCaller.post({ hostname: 'flipkart.com/200/html' }, { 'key': 'value' })
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.body).to.equal('{"key":"value"}');
        done();
      });
  });

  it('.put() should stringify body data', function(done) {
    ApiCaller.put({ hostname: 'flipkart.com/200/html' }, { 'key': 'value' })
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.body).to.equal('{"key":"value"}');
        done();
      });
  });

  it('should reject with network error if network fails', function(done) {
    ApiCaller.get({ hostname: 'flipkart.com' })
      .then(null, function(err) {
        expect(err).to.be.an.instanceOf(NetworkError);
        done();
      });
  });

  it('should reject with generic error if some other issue', function(done) {
    ApiCaller.get({ hostname: 'flipkart.com/err' })
      .then(null, function(err) {
        expect(err).to.be.an.instanceOf(Error);
        done();
      });
  });
});
