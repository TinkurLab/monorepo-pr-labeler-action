const app = require('../app')
const helpers = require('../helpers')

jest.mock('../helpers')

describe('prMonorepoRepoLabeler', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should label pr with 2 repos if pr has 2 monorepo repos', async () => {
    let eventData, fileData
    helpers.readFilePromise = jest.fn(() => eventData)
    helpers.listFiles = jest.fn(() => fileData)
    helpers.getMonorepo = jest.fn()
    helpers.addLabel = jest.fn()
    eventData = `{
            "action": "edited",
            "pull_request": {
              "number": 54,
              "merged": false
            }
          }`
    fileData = [
      {
        filename: 'repo1/path/path/code1.js'
      },
      {
        filename: 'repo1/path/path/code2.js'
      },
      {
        filename: 'code3.js'
      }
    ]

    helpers.getMonorepo
      .mockReturnValueOnce('repo 1')
      .mockReturnValueOnce('repo 1')
      .mockReturnValueOnce('repo 2')
      .mockReturnValueOnce(false)

    await app.prMonorepoRepoLabeler()

    expect(helpers.readFilePromise).toHaveBeenCalledTimes(1)
    expect(helpers.addLabel).toHaveBeenCalledTimes(2)
    expect(helpers.addLabel.mock.calls[0][4]).toContain('repo 1')
    expect(helpers.addLabel.mock.calls[1][4]).toContain('repo 2')
  })

  it('should label pr with 1 repo if pr has 1 monorepo repo', async () => {
    let eventData, fileData
    helpers.readFilePromise = jest.fn(() => eventData)
    helpers.listFiles = jest.fn(() => fileData)
    helpers.getMonorepo = jest.fn()
    helpers.addLabel = jest.fn()
    eventData = `{
            "action": "edited",
            "pull_request": {
              "number": 54,
              "merged": false
            }
          }`
    fileData = [
      {
        filename: 'repo1/path/path/code1.js'
      },
      {
        filename: 'repo1/path/path/code2.js'
      },
      {
        filename: 'code3.js'
      }
    ]

    helpers.getMonorepo
      .mockReturnValueOnce('repo 1')
      .mockReturnValueOnce('repo 1')

    await app.prMonorepoRepoLabeler()

    expect(helpers.readFilePromise).toHaveBeenCalledTimes(1)
    expect(helpers.addLabel).toHaveBeenCalledTimes(1)
    expect(helpers.addLabel.mock.calls[0][4]).toContain('repo 1')
  })

  it('should NOT label pr if pr has 0 monorepo repos', async () => {
    let eventData, fileData
    helpers.readFilePromise = jest.fn(() => eventData)
    helpers.listFiles = jest.fn(() => fileData)
    helpers.getMonorepo = jest.fn()
    helpers.addLabel = jest.fn()
    eventData = `{
            "action": "edited",
            "pull_request": {
              "number": 54,
              "merged": false
            }
          }`
    fileData = [
      {
        filename: 'code3.js'
      }
    ]

    helpers.getMonorepo.mockReturnValueOnce(false)

    await app.prMonorepoRepoLabeler()

    expect(helpers.readFilePromise).toHaveBeenCalledTimes(1)
    expect(helpers.addLabel).toHaveBeenCalledTimes(0)
  })
})
