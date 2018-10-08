import Chai from 'chai'
import dispatcher from '../src'

Chai.should();

describe('dispatcher', () => {
  it('should ignore actions not in namespace', () => {
    var logged = '';
    var sut = dispatcher('test', { }, msg => logged = msg);

    var result = sut({})(_ => 1)({ type: 'nottest' });

    result.should.equal(1);
    logged.should.equal('');
  });
  it('should fail nicely for non-existent actions', () => {
    var logged = '';
    var sut = dispatcher('test', { }, msg => logged = msg);

    var result = sut({})(_ => 1)({ type: 'test/x' });

    result.should.equal(1);
    logged.should.equal("Dispatcher for 'test' has no registered handler for 'x'");
  });
  it('should call provided handler when type matches', () => {
    var called = false;
    var sut = dispatcher('test', { method: () => { called = true; } }, _ => {});

    var result = sut({})(_ => 1)({ type: 'test/method' });

    Chai.expect(result).to.be.undefined;
    called.should.equal(true);
  });
  it('should allow disabling console logging', () => {
    var sut = dispatcher('test', { }, false);

    var result = sut({})(_ => 1)({ type: 'test/x' });

    result.should.equal(1);
  });
});
