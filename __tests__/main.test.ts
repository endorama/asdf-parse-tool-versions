import {expect, test} from '@jest/globals'

import {toEnvVarName} from '../src/main'

test('toEnvVarName converts tool names to environment variable names', () => {
  expect(toEnvVarName('golang')).toBe('GOLANG_VERSION')
  expect(toEnvVarName('ruby')).toBe('RUBY_VERSION')
  expect(toEnvVarName('golangci-lint')).toBe('GOLANGCI_LINT_VERSION')
  expect(toEnvVarName('nodejs')).toBe('NODEJS_VERSION')
})
