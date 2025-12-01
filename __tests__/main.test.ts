import * as path from 'node:path'
import {expect, test} from '@jest/globals'
import {parseToolVersions, getPathToFile} from '../src/asdf'
import {toEnvVarName} from '../src/main'


test('parse a file in default working directory', async () => {
  const tools = await parseToolVersions(path.join(__dirname, 'tool-versions'))

  // console.log(tools)
  expect(tools.size).toBe(4)
  expect(tools.has('golang')).toBeTruthy()
  expect(tools.get('golang')).toBe('1.12.5')
  expect(tools.has('ruby')).toBeTruthy()
  expect(tools.get('ruby')).toBe('2.7.0')
  expect(tools.has('golangci_lint')).toBeTruthy()
  expect(tools.get('golangci_lint')).toBe('1.64.8')
  expect(tools.has('terraform')).toBeTruthy()
  expect(tools.get('terraform')).toBe('1.13.4')
})

test('parse a file in user defined working directory', async () => {
  const file = await setPathToFile(path.join(__dirname, 'user-defined'))
  const tools = await parseToolVersions(file)

  // console.log(tools)
  expect(tools.size).toBe(4)
  expect(tools.has('golang')).toBeTruthy()
  expect(tools.get('golang')).toBe('1.12.5')
  expect(tools.has('ruby')).toBeTruthy()
  expect(tools.get('ruby')).toBe('2.7.0')
  expect(tools.has('golangci_lint')).toBeTruthy()
  expect(tools.get('golangci_lint')).toBe('1.64.8')
  expect(tools.has('terraform')).toBeTruthy()
  expect(tools.get('terraform')).toBe('1.14.0')
})

test('toEnvVarName converts tool names to environment variable names', () => {
  expect(toEnvVarName('golang')).toBe('GOLANG_VERSION')
  expect(toEnvVarName('ruby')).toBe('RUBY_VERSION')
  expect(toEnvVarName('golangci-lint')).toBe('GOLANGCI_LINT_VERSION')
  expect(toEnvVarName('nodejs')).toBe('NODEJS_VERSION')
})

// Mock the @actions/core module to control getInput behavior
jest.mock('@actions/core', () => ({
  getInput: jest.fn(), // Mock the getInput function
  setFailed: jest.fn() // Mock other core functions if needed
}))
