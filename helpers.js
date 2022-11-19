const fs = require('fs')

module.exports.readFilePromise = function (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  }).catch((err) => {
    console.log(err)
  })
}

module.exports.getOwner = function (eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/')
  return eventOwnerAndRepo.slice(0, slicePos1)
}

module.exports.getRepo = function (eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/')
  return eventOwnerAndRepo.slice(slicePos1 + 1, eventOwnerAndRepo.length)
}

module.exports.listFiles = async function (octokit, eventOwner, eventRepo, eventIssueNumber) {
  const options = octokit.rest.pulls.listFiles.endpoint.merge({
    owner: eventOwner,
    repo: eventRepo,
    pull_number: eventIssueNumber,
  })

  return await octokit
    .paginate(options)
    .then((data) => {
      return data
    })

    .catch((err) => {
      console.log(err)
    })
}

module.exports.getMonorepo = function (baseDirectories, filePath) {
  const regexPattern = `^${baseDirectories}([^./]*)/`
  var regex = new RegExp(regexPattern)
  var found = filePath.match(regex)

  if (found) return found[1]
  else return false
}

module.exports.addLabel = function (octokit, eventOwner, eventRepo, eventIssueNumber, label) {
  octokit.rest.issues
    .addLabels({
      owner: eventOwner,
      repo: eventRepo,
      issue_number: eventIssueNumber,
      labels: [label], // ['Label 1']
    })
    .then(({ data, headers, status }) => {
      // handle data
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports.getLabel = function (repo) {
  const prefix = process.env.INPUT_PREFIX || ''
  const suffix = process.env.INPUT_SUFFIX || ''
  const separator = process.env.INPUT_SEPARATOR || ''
  repo = repo || ''

  const label = `${prefix}${separator}${repo}${separator}${suffix}`.trim()

  return label
}
