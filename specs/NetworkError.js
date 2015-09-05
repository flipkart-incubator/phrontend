import NetworkError from '../src/NetworkError.js';

describe('NetworkError', function() {
  it('should init with default values if not passed', function() {
    var ne1 = new NetworkError();
    expect(ne1.name).to.equal('NetworkError');
    expect(ne1.message).to.equal('Network Error');
  });
  it('should init with given message if passed', function() {
    var ne1 = new NetworkError('Custom Message');
    expect(ne1.name).to.equal('NetworkError');
    expect(ne1.message).to.equal('Custom Message');
  });
  it('should have a static isNetworkError method defined which does instanceof check', function() {
    var ne1 = new NetworkError();
    expect(NetworkError.isNetworkError).to.be.a('function');
    expect(NetworkError.isNetworkError(ne1)).to.equal(true);
  });
  it('should throw error if called as a function', function() {
    expect(NetworkError).to.throw(TypeError);
  });
});
