var fs = require('fs')
var p = require('path')
var minimatch = require('minimatch')

function patternMatcher(pattern) {
  return function(path, stats) {
    return stats.isFile() && minimatch(path, pattern, {matchBase: true})
  }
}

function toMatcherFunction(ignoreEntry) {
  if (typeof ignoreEntry == 'function') {
    return ignoreEntry
  } else {
    return patternMatcher(ignoreEntry)
  }
}

function readdir(path, includes, callback) {
  if (typeof includes == 'function') {
    callback = includes
    includes = []
  }
  includes = includes.map(toMatcherFunction)

  var list = []

  fs.readdir(path, function(err, files) {
    if (err) {
      return callback(err)
    }

    var pending = files.length
    if (!pending) {
      // we are done, woop woop
      return callback(null, list)
    }

    files.forEach(function(file) {
      fs.lstat(p.join(path, file), function(_err, stats) {
        if (_err) {
          return callback(_err)
        }

        file = p.join(path, file)

        if (stats.isDirectory()) {
          readdir(file, includes, function(__err, res) {
            if (__err) {
              return callback(__err)
            }

            list = list.concat(res)
            pending -= 1
            if (!pending) {
              return callback(null, list)
            }
          })
        } else if (!includes.some(function(matcher) { return matcher(file, stats) })) {
          pending -= 1
          if (!pending) {
            return callback(null, list)
          }
          return null
        } else {          
          list.push(file)
          pending -= 1
          if (!pending) {
            return callback(null, list)
          }
        }

      })
    })
  })
}

module.exports = readdir