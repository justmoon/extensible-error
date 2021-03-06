import chai = require('chai')
import ExtensibleError = require('../src')
const assert = chai.assert

const blowUp = () => { throw new ExtensibleError('It went bad!') }

describe('ExtensibleError', function () {
  it('should be a constructor', function () {
    assert.isFunction(ExtensibleError)
  })

  describe('instance', function () {
    beforeEach(function () {
      try {
        blowUp()
      } catch (err) {
        this.err = err
      }
    })

    it('should have a name property', function () {
      assert.equal(this.err.name, 'ExtensibleError')
    })

    it('should be an instance of ExtensibleError', function () {
      assert.instanceOf(this.err, ExtensibleError)
    })

    it('should be an instance of Error', function () {
      assert.instanceOf(this.err, Error)
    })

    it('should be recognized by Node\'s util.isError', function () {
      assert.ok(require('util').isError(this.err))
    })

    describe('toString', function () {
      it('should return a properly formatted message', function () {
        assert.equal(this.err.toString(), 'ExtensibleError: It went bad!')
      })
    })

    describe('stack', function () {
      it('should be a string', function () {
        assert.isString(this.err.stack)
      })

      it('should start with the default error message formatting', function () {
        assert.strictEqual(
          this.err.stack.split('\n')[0],
          'ExtensibleError: It went bad!'
        )
      })

      it('should contain the stack frame with the function that threw in the first slot', function () {
        assert.strictEqual(this.err.stack.split('\n')[1].indexOf('blowUp'), 7)
      })
    })
  })

  describe('subclass', function () {
    beforeEach(function () {
      this.CustomError = class CustomError extends ExtensibleError {
        extra: number

        constructor (message: string, extra: number) {
          super(message)

          this.extra = extra
        }
      }
    })

    it('should be a constructor', function () {
      assert.isFunction(this.CustomError)
    })

    describe('instance', function () {
      beforeEach(function () {
        const CustomError = this.CustomError

        function boom () {
          throw new CustomError('Not great!', 42)
        }

        try {
          boom()
        } catch (err) {
          this.err = err
        }
      })

      it('should have a name property', function () {
        assert.equal(this.err.name, 'CustomError')
      })

      it('should be an instance of ExtensibleError', function () {
        assert.instanceOf(this.err, ExtensibleError)
      })

      it('should be an instance of Error', function () {
        assert.instanceOf(this.err, Error)
      })

      it('should be recognized by Node\'s util.isError', function () {
        assert.ok(require('util').isError(this.err))
      })

      describe('toString', function () {
        it('should return a properly formatted message', function () {
          assert.equal(this.err.toString(), 'CustomError: Not great!')
        })
      })

      describe('stack', function () {
        it('should be a string', function () {
          assert.isString(this.err.stack)
        })

        it('should start with the default error message formatting', function () {
          assert.strictEqual(
            this.err.stack.split('\n')[0],
            'CustomError: Not great!'
          )
        })

        it('should contain the stack frame with the function that threw in the first slot', function () {
          assert.strictEqual(this.err.stack.split('\n')[1].indexOf('boom'), 7)
        })
      })
    })
  })
})
