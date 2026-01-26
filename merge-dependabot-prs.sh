#!/usr/bin/env bash
set -euo pipefail

# Script to merge all passing Dependabot PRs.
# Usage: ./merge-dependabot-prs.sh

[ -n "${DEBUG:-}" ] && set -x

echo "Fetching Dependabot PRs..."

# Get all open PRs from Dependabot with their status checks.
prs=$(gh pr list --author "app/dependabot" --json number,title,statusCheckRollup --limit 100)

if [[ $(echo "$prs" | jq 'length') -eq 0 ]]; then
    echo "No Dependabot PRs found."
    exit 0
fi

echo "Found $(echo "$prs" | jq 'length') Dependabot PR(s)"
echo ""

echo "$prs" | jq -c '.[]' | while read -r pr; do
    pr_number=$(echo "$pr" | jq -r '.number')
    pr_title=$(echo "$pr" | jq -r '.title')
    all_passed=$(echo "$pr" | jq -r '
        if (.statusCheckRollup | length) == 0 then
            "true"
        else
            .statusCheckRollup | all(.conclusion == "SUCCESS") | tostring
        end
    ')
    
    echo "PR #${pr_number}: ${pr_title}"
    
    if [[ "$all_passed" == "true" ]]; then
        echo "  ✅ All checks passed - merging..."
        if gh pr merge "$pr_number" --auto --squash --delete-branch; then
            echo "  ✅ Merge triggered for PR #${pr_number}"
        else
            echo "  ❌ Failed to merge PR #${pr_number}"
        fi
    else
        echo "  ❌ Some checks failed or are pending - skipping"
        # Show which checks failed.
        echo "$pr" | jq -r '.statusCheckRollup[] | select(.conclusion != "SUCCESS") | "     - \(.name): \(.conclusion)"'
    fi
    echo ""
done

echo "Done!"
