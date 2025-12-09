import * as path from 'node:path'
import {expect, test} from '@jest/globals'

import {getPathToFile, parseToolVersions} from '../src/asdf'

test('parseToolVersions correctly parses a file', async () => {
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

test('getPathToFile selects the root working directory when empty', () => {
  const want = path.join(process.cwd(), '.tool-versions')
  expect(getPathToFile('')).toBe(want)
})

test('getPathToFile selects specified working directory', () => {
  const want = 'specific-folder/.tool-versions'
  expect(getPathToFile('specific-folder')).toBe(want)
})
