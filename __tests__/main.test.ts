import * as path from 'node:path'
import {expect, test} from '@jest/globals'

import {parseToolVersions} from '../src/asdf'

test('parse a file', async () => {
  const tools = await parseToolVersions(path.join(__dirname, 'tool-versions'))

  // console.log(tools)
  expect(tools.size).toBe(3)
  expect(tools.has('golang')).toBeTruthy()
  expect(tools.get('golang')).toBe('1.12.5')
  expect(tools.has('ruby')).toBeTruthy()
  expect(tools.get('ruby')).toBe('2.7.0')
  expect(tools.has('golangci_lint')).toBeTruthy()
  expect(tools.get('golangci_lint')).toBe('1.64.8')
})
