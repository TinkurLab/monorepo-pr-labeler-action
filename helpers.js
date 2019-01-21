const fs = require('fs')

module.exports.readFilePromise = function(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  }).catch(err => {
    console.log(err)
  })
}

module.exports.getOwner = function(eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/')
  return eventOwnerAndRepo.slice(0, slicePos1)
}

module.exports.getRepo = function(eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/')
  return eventOwnerAndRepo.slice(slicePos1 + 1, eventOwnerAndRepo.length)
}

module.exports.listFiles = async function(
  octokit,
  eventOwner,
  eventRepo,
  eventIssueNumber
) {
  return await octokit.pulls
    .listFiles({
      owner: eventOwner,
      repo: eventRepo,
      number: eventIssueNumber
    })
    .then(({ data, headers, status }) => {
      return data
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports.getMonorepo = function(filePath) {
  var regex = /^([^./]*)\//
  var found = filePath.match(regex)

  if (found) return found[0].substring(0, found[0].length - 1)
  else return false
}

module.exports.addLabel = function(
  octokit,
  eventOwner,
  eventRepo,
  eventIssueNumber,
  label
) {
  octokit.issues
    .addLabels({
      owner: eventOwner,
      repo: eventRepo,
      number: eventIssueNumber,
      labels: [label] // ['Incomplete Tasks']
    })
    .then(({ data, headers, status }) => {
      // handle data
    })
    .catch(err => {
      console.log(err)
    })
}
