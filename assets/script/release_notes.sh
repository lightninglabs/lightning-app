#!/bin/sh

# exit on immediately on non-zero status
set -e
# avoid issues with relative paths
cd "$(dirname "$0")"

if [ "$(uname)" == "Darwin" ]; then
  echo "Cannot release on macOS"
  exit 0
fi

if [ -z "$(eval "echo \$GH_TOKEN")" ]; then
  echo "Missing environment variable GH_TOKEN."
  exit 1
fi

GITHUB_API_ENDPOINT="https://api.github.com/repos/lightninglabs/lightning-app/releases"
CURRENT_TAG=v$(sed -n 's/.*"version": "\(.*\)".*/\1/p' ../../package.json)
PREVIOUS_TAG=$(git describe --tags --abbrev=0 "$(git rev-list --tags --skip=1 --max-count=1)")
RELEASE_NOTES="\\n# Release Notes\\n$(git log "${PREVIOUS_TAG}"..HEAD \
  --merges --pretty='* %b [%h](http://github.com/lightninglabs/lightning-app/commit/%H)\n')"

# get existing release from Github
RELEASE=$(echo \
  '{"releases": '"$(curl -H "Content-Type: application/json" \
  -H "Authorization: token $GH_TOKEN" \
  $GITHUB_API_ENDPOINT)"'}' \
  | jq '.releases[] | select(.tag_name == "'"$CURRENT_TAG"'") | {id, name, tag_name, target_commitish, body, draft}')

if [ -z "$RELEASE" ]; then
  echo "Release not found for tag $CURRENT_TAG."
  exit 1
fi

# append release notes to the existing release
UPDATED_RELEASE_NOTES="$(echo "$RELEASE" | jq -r .body)"$RELEASE_NOTES
UPDATED_RELEASE=$(echo "$RELEASE" | jq ".body |= \"$UPDATED_RELEASE_NOTES\"")
UPDATE_API_ENDPOINT=$GITHUB_API_ENDPOINT/$(echo "$RELEASE" | jq -r .id)
curl \
  -H "Content-Type: application/json" \
  -H "Authorization: token $GH_TOKEN" \
  -X PATCH \
  -d "$UPDATED_RELEASE" \
  "$UPDATE_API_ENDPOINT";
