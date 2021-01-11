const helpers = require('../helpers')
let { Octokit } = require('@Octokit/rest')

Octokit = jest.fn()
Octokit.authenticate = jest.fn()

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
    const baseDirectories = ''

    const result = await helpers.getMonorepo(baseDirectories, fileName)

    expect(result).toBe('repo1')
  })

  it('should return monorepo repo within subdirectory if it exists for the file', async () => {
    const fileName = 'directory1/repo1/path/path/code.js'
    const baseDirectories = `(?:directory1)\/`

    const result = await helpers.getMonorepo(baseDirectories, fileName)

    expect(result).toBe('repo1')
  })

  it('should return monorepo repo within multiple subdirectories if it exists for the file', async () => {
    const fileName = 'directory2/repo1/path/path/code.js'
    const baseDirectories = `(?:directory1|directory2)\/`

    const result = await helpers.getMonorepo(baseDirectories, fileName)

    expect(result).toBe('repo1')
  })

  it('should return false if monorepo does NOT exists for the file', async () => {
    const fileName = 'code.js'
    const baseDirectories = ''

    const result = await helpers.getMonorepo(baseDirectories, fileName)

    expect(result).toBe(false)
  })

  it('should return false if monorepo starts with a .', async () => {
    const fileName = '.github/main.workflow'
    const baseDirectories = ''

    const result = await helpers.getMonorepo(baseDirectories, fileName)

    expect(result).toBe(false)
  })
})

describe('addLabel', () => {
  it('should add label to issue', async () => {
    let Octokit = {
      issues: {
        addLabels: jest.fn().mockResolvedValue({ something: 'something' }),
      },
    }

    const result = await helpers.addLabel(Octokit, 'waffleio', 'waffle.io', '1', 'Incomplete Tasks')
    expect(Octokit.issues.addLabels).toHaveBeenCalledTimes(1)
    expect(Octokit.issues.addLabels.mock.calls[0][0].labels).toEqual(['Incomplete Tasks'])
  })
})

describe('getLabel', () => {
  afterEach(() => {
    delete process.env.INPUT_PREFIX
    delete process.env.INPUT_SUFFIX
  })

  it('Returns label with prefix & suffic attached to repo name', () => {
    process.env.INPUT_PREFIX = 'sample_prefix'
    process.env.INPUT_SUFFIX = 'sample_suffix'

    const repoName = 'sample_repo'

    expect(helpers.getLabel(repoName)).toBe('sample_prefix sample_repo sample_suffix')
  })

  it('Returns label only with suffix when only suffix passed as input', () => {
    process.env.INPUT_SUFFIX = 'sample_suffix'
    const repoName = 'sample_repo'

    expect(helpers.getLabel(repoName)).toBe('sample_repo sample_suffix')
  })

  it('Returns label only with prefix when only prefix passed as input', () => {
    process.env.INPUT_SUFFIX = 'sample_prefix'
    const repoName = 'sample_repo'

    expect(helpers.getLabel(repoName)).toBe('sample_repo sample_prefix')
  })

  it('Returns only repo name when no prefix & suffix', () => {
    expect(helpers.getLabel('sample_repo')).toBe('sample_repo')
  })

  it('returns empty string without input & without argument', () => {
    expect(helpers.getLabel()).toBe('')
  })
})
