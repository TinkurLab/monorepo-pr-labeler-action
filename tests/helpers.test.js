const helpers = require('../helpers')
let octokit = require('@octokit/rest')()

octokit = jest.fn()
octokit.authenticate = jest.fn()

describe('getOwner', () => {
  it('should return owner when passed GITHUB_REPOSITORY env variable', () => {
    const result = helpers.getOwner('waffleio/waffle.io')
    expect(result).toBe('waffleio')
  })
})

describe('getRepo', () => {
  it('should return repo when passed GITHUB_REPOSITORY env variable', () => {
    const result = helpers.getRepo('waffleio/waffle.io')
    expect(result).toBe('waffle.io')
  })
})

describe('getMonorepo', () => {
  it('should return monorepo repo if it exists for the file', async () => {
    const fileName = 'repo1/path/path/code.js'

    const result = await helpers.getMonorepo(fileName)

    expect(result).toBe('repo1')
  })

  it('should return false if monorepo does NOT exists for the file', async () => {
    const fileName = 'code.js'

    const result = await helpers.getMonorepo(fileName)

    expect(result).toBe(false)
  })

  it('should return false if monorepo starts with a .', async () => {
    const fileName = '.github/main.workflow'

    const result = await helpers.getMonorepo(fileName)

    expect(result).toBe(false)
  })
})

describe('addLabel', () => {
  it('should add label to issue', async () => {
    let octokit = {
      issues: {
        addLabels: jest.fn().mockResolvedValue({ something: 'something' })
      }
    }

    const result = await helpers.addLabel(
      octokit,
      'waffleio',
      'waffle.io',
      '1',
      'Incomplete Tasks'
    )
    expect(octokit.issues.addLabels).toHaveBeenCalledTimes(1)
    expect(octokit.issues.addLabels.mock.calls[0][0].labels).toEqual([
      'Incomplete Tasks'
    ])
  })
})
