console.log('started nodejs...')

const helpers = require('./helpers')
const _ = require('underscore')

//require octokit rest.js
//more info at https://github.com/octokit/rest.js
const octokit = require('@octokit/rest')()

//set octokit auth to action's GITHUB_TOKEN env variable
octokit.authenticate({
  type: 'app',
  token: process.env.GITHUB_TOKEN
})

//set eventOwner and eventRepo based on action's env variables
const eventOwnerAndRepo = process.env.GITHUB_REPOSITORY
const eventOwner = helpers.getOwner(eventOwnerAndRepo)
const eventRepo = helpers.getRepo(eventOwnerAndRepo)

async function prMonorepoRepoLabeler() {
  //read contents of action's event.json
  const eventData = await helpers.readFilePromise(
    '..' + process.env.GITHUB_EVENT_PATH
  )
  const eventJSON = JSON.parse(eventData)

  //set eventAction and eventIssueNumber
  eventAction = eventJSON.action
  eventIssueNumber = eventJSON.pull_request.number

  //get list of files in PR
  const prFiles = await helpers.listFiles(
    octokit,
    eventOwner,
    eventRepo,
    eventIssueNumber
  )

  //get monorepo repo for each file
  prFilesRepos = prFiles.map(({ filename }) => helpers.getMonorepo(filename))

  //reduce to unique repos
  const prFilesReposUnique = _.uniq(prFilesRepos)

  //add label for each monorepo repo
  for (const repo of prFilesReposUnique) {
    if (repo) {
      console.log(`labeling repo: ${repo}`)

      const repoLabel = `📁 Repo: ${repo}`

      helpers.addLabel(
        octokit,
        eventOwner,
        eventRepo,
        eventIssueNumber,
        repoLabel
      )
    }
  }
}

//run the function
prMonorepoRepoLabeler()

module.exports.prMonorepoRepoLabeler = prMonorepoRepoLabeler
