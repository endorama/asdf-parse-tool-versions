#!/usr/bin/env bash

set -eou pipefail

checkenv() {
  local envname
  envname="$1"
  local expected
  expected="$2"

  got=$(printenv "$envname")
  if [[ "${got:-}" != "$expected" ]]; then
    echo "$envname differs from expectations: got: '${got:-missing}' expected: '$expected'"
    return 2
  fi
  return 0
}

errors=0
if ! checkenv "GOLANG_VERSION" "1.12.5"; then
  errors=$((errors + 1))
fi
if ! checkenv "RUBY_VERSION" "2.7.0"; then
  errors=$((errors + 1))
fi
if ! checkenv "GOLANGCI_LINT_VERSION" "1.64.8"; then
  errors=$((errors + 1))
fi
if ! checkenv "TERRAFORM_VERSION" "1.13.4"; then
  errors=$((errors + 1))
fi

if [[ ! $errors -eq 0 ]]; then
  echo "Some error occurred, test failed"
  exit 1
fi
