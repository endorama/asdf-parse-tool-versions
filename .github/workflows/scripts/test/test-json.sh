#!/usr/bin/env bash

set -eou pipefail

json="$1"

check_json() {
  local key
  key="$1"
  local value
  value="$2"
  if ! echo "$json" | jq ".$key" | grep -q "$value"; then
    echo "'$key' does not have the expected value: '$value'"
    return 1
  fi
  return 0
}

echo "input: '$json'"

errors=0
if ! check_json "golang" "1.12.5"; then
  errors=$((errors + 1))
fi
if ! check_json "ruby" "2.7.0"; then
  errors=$((errors + 1))
fi
if ! check_json "golangci_lint" "1.64.8"; then
  errors=$((errors + 1))
fi
if ! check_json "terraform" "1.13.4"; then
  errors=$((errors + 1))
fi

if [[ ! $errors -eq 0 ]]; then
  echo "Some error occurred, test failed"
  exit 1
fi
