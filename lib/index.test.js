/* eslint-env jest */

const Metalsmith = require('metalsmith')
const equal = require('assert-dir-equal')
const rimraf = require('rimraf')
const path = require('path')
const plugin = require('./index')
const BuildEngine = require('../test/engines/build')
const ErrorEngine = require('../test/engines/error')
const OptionsEngine = require('../test/engines/options')

describe('metalsmith-in-place', () => {
  it('should process a single file', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'single-file')
    const actual = path.join(base, 'build')
    const expected = path.join(base, 'expected')
    const metalsmith = new Metalsmith(base)

    rimraf.sync(actual)

    return metalsmith.use(plugin({ engine: BuildEngine })).build(err => {
      if (err) {
        return done(err)
      }
      expect(() => equal(actual, expected)).not.toThrow()
      return done()
    })
  })

  it('should process multiple files', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'multiple-files')
    const actual = path.join(base, 'build')
    const expected = path.join(base, 'expected')
    const metalsmith = new Metalsmith(base)

    rimraf.sync(actual)

    return metalsmith.use(plugin({ engine: BuildEngine })).build(err => {
      if (err) {
        return done(err)
      }
      expect(() => equal(actual, expected)).not.toThrow()
      return done()
    })
  })

  it('should only process files that match the string pattern', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'string-pattern-process')
    const actual = path.join(base, 'build')
    const expected = path.join(base, 'expected')
    const metalsmith = new Metalsmith(base)

    rimraf.sync(actual)

    return metalsmith
      .use(
        plugin({
          pattern: '*.md',
          engine: BuildEngine
        })
      )
      .build(err => {
        if (err) {
          return done(err)
        }
        expect(() => equal(actual, expected)).not.toThrow()
        return done()
      })
  })

  it('should only process files that match the array pattern', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'array-pattern-process')
    const actual = path.join(base, 'build')
    const expected = path.join(base, 'expected')
    const metalsmith = new Metalsmith(base)

    rimraf.sync(actual)

    return metalsmith
      .use(
        plugin({
          pattern: ['index.md', 'extra.md'],
          engine: BuildEngine
        })
      )
      .build(err => {
        if (err) {
          return done(err)
        }
        expect(() => equal(actual, expected)).not.toThrow()
        return done()
      })
  })

  it('should fall back to the default engine', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'default-engine')
    const actual = path.join(base, 'build')
    const expected = path.join(base, 'expected')
    const metalsmith = new Metalsmith(base)

    rimraf.sync(actual)

    return metalsmith.use(plugin()).build(err => {
      if (err) {
        return done(err)
      }
      expect(() => equal(actual, expected)).not.toThrow()
      return done()
    })
  })

  it('should return an error when there are no valid files to process', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'no-files')
    const metalsmith = new Metalsmith(base)

    return metalsmith.use(plugin()).build(err => {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toMatchSnapshot()
      done()
    })
  })

  it('should return an error for an invalid pattern', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'invalid-pattern')
    const metalsmith = new Metalsmith(base)

    return metalsmith
      .use(
        plugin({
          pattern: () => {}
        })
      )
      .build(err => {
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toMatchSnapshot()
        done()
      })
  })

  it('should catch errors from the engine', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'engine-error')
    const metalsmith = new Metalsmith(base)

    return metalsmith.use(plugin({ engine: ErrorEngine })).build(err => {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toMatchSnapshot()
      done()
    })
  })

  it('should pass the engine options to the engine', done => {
    const base = path.join(process.cwd(), 'test', 'fixtures', 'engine-options')
    const actual = path.join(base, 'build')
    const expected = path.join(base, 'expected')
    const metalsmith = new Metalsmith(base)

    rimraf.sync(actual)

    return metalsmith
      .use(
        plugin({
          engine: OptionsEngine,
          engineOptions: {
            optionOne: 'value',
            optionTwo: 'value'
          }
        })
      )
      .build(err => {
        if (err) {
          return done(err)
        }
        expect(() => equal(actual, expected)).not.toThrow()
        return done()
      })
  })
})
