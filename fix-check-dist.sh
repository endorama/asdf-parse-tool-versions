#!/usr/bin/env bash
set -euo pipefail

# Script to fix check-dist failures by rebuilding with the CI's Node version.
# Usage: ./fix-check-dist.sh [PR_NUMBER]
#        If PR_NUMBER is omitted, will use the current branch's PR if available.

[ -n "${DEBUG:-}" ] && set -x

if [ $# -eq 0 ]; then
    echo "No PR number provided, checking if current branch has a PR..."
    if ! PR_NUMBER=$(gh pr view --json number -q .number 2>/dev/null); then
        echo "Error: Not on a PR branch and no PR number provided"
        echo "Usage: $0 [PR_NUMBER]"
        exit 1
    fi
    echo "Found PR #${PR_NUMBER} for current branch"
elif [ $# -eq 1 ]; then
    PR_NUMBER=$1
    echo "Checking out PR #${PR_NUMBER}..."
    gh pr checkout "$PR_NUMBER"
else
    echo "Usage: $0 [PR_NUMBER]"
    exit 1
fi

echo "Fixing check-dist for PR #${PR_NUMBER}"
echo ""

echo "Rebuilding dist/ with Node $REBUILD_NODE_VERSION..."
npm ci
npm run build
npm run package
echo ""

echo "Check changes..."
if [ "$(git diff --ignore-space-at-eol dist/ | wc -l)" -gt "0" ]; then
    echo "✅ Changes detected in dist/"
    echo ""
    echo "Changes summary:"
    git diff --stat --text dist/
    echo ""
    echo "Committing changes..."
    git add dist/
    
    COMMIT_MSG="chore: rebuild dist/

The check-dist workflow failed because the dist/ files changed
by the dependencies updates."
    
    git commit -m "$COMMIT_MSG"
    echo ""
    echo "Pushing changes..."
    git push
    echo ""
    echo "✅ Done! The dist/ folder rebuilt and pushed."
    echo "🔗 PR: $(gh pr view $PR_NUMBER --json url -q .url)"
else
    echo "ℹ️  No changes detected in dist/"
    echo ""
    echo "Checking latest CI run status..."
    gh pr checks "$PR_NUMBER"
fi
