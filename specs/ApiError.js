import ApiError from '../src/ApiError.js';

describe('ApiError', function() {
  it('should init with default values if not passed', function() {
    var ae = new ApiError();
    expect(ae.name).to.equal('ApiError');
    expect(ae.message).to.equal('Error in API');
  });
  it('should init with given message if passed', function() {
    var ae = new ApiError('Custom Message');
    expect(ae.name).to.equal('ApiError');
    expect(ae.message).to.equal('Custom Message');
  });
  it('should have a static isApiError method defined which does instanceof check', function() {
    var ae = new ApiError();
    expect(ApiError.isApiError).to.be.a('function');
    expect(ApiError.isApiError(ae)).to.equal(true);
  });
  it('should throw error if called as a function', function() {
    expect(ApiError).to.throw(TypeError);
  });
});
