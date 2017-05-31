const Subject = require("../createWorkerThread");
const { assert } = require('chai');
const sinon = require('sinon');
const R = require('ramda');
const spawnForegroundWorker = require('./utils/spawnForegroundWorker')
const createMemoryStream = require('./utils/createMemoryStream')
const mochaJanitor = require('./utils/mochaJanitor')

describe("dividus::createWorkerThread", function() {
  const janitor = mochaJanitor(this);
  const disposable = x => R.tap(() => janitor.push(done => x.close(done)))(x)

  it('can spawn and despawn the worker using fork()', function(done) {
    const subject = disposable(Subject({}));

    subject.open(function(err) {
      assert.ok(subject.isOpen());

      done(err);
    });
  });

  it('reports spawn errors', function(done) {
    const { local } = createMemoryStream();
    const subject = Subject({
      spawnFn() {
        return local;
      }
    });

    subject.open(function(err) {
      if (!err) {
        done("should've failed!!!")
      }
      else {
        assert.equal(err.toString(), 'XXX');
        assert.notOk(subject.isOpen());

        done();
      }
    });

    local.emit('error', 'XXX')
  });

  it('does not report an exit with code 0 as an error', function(done) {
    const { local, remote } = createMemoryStream();
    const subject = Subject({
      spawnFn() {
        return local;
      }
    });

    subject.open(function(err) {
      if (err) {
        done(err)
      }
      else {
        assert.ok(subject.isOpen());
        local.emit('exit', 0)
        assert.notOk(subject.isOpen());
        done();
      }
    });

    remote.send({ name: 'READY' });
  });

  it('can communicate with the worker', function(done) {
    const sandbox = sinon.sandbox.create();
    const { local, remote } = createMemoryStream();
    const accept = sandbox.spy(function(message) {
      remote.send({ id: message.id, data: [ null, 1 ] })
    });

    janitor.push(() => sandbox.restore())

    remote.on('message', accept)

    const subject = disposable(Subject({ spawnFn: () => local }));

    subject.open(function(err) {
      if (err) {
        done(err);
      }
      else {
        const data = { foo: '1' };

        subject.send('PING', data, function(err, result) {
          assert.called(accept);

          assert.include(accept.getCall(0).args[0], {
            id: '1',
            name: 'PING',
            data
          });

          assert.equal(result, 1);

          done();
        });
      }
    })

    remote.send({ name: 'READY' });
  });

  it('does not allow sending if not open', function() {
    const subject = Subject({ spawnFn: spawnForegroundWorker });

    assert.throws(function() {
      subject.send({});
    }, 'Thread must be open.');
  })
});