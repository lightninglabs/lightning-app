#!/usr/bin/env bash
set -e
# avoid issues with relative paths
cd $(dirname $0)

if [ -z "$(eval "echo \$GH_TOKEN")" ]; then
  echo "Missing environment variable GH_TOKEN."
  exit 1
fi

TEMP_DATA_JSON="release.json"
PACKAGE="package.json"
GITHUB_API_ENDPOINT="https://api.github.com/repos/erkarl/lightning-app/releases"

if [ $# -ne 1 ]; then
    echo You must provide only a release version!
    echo Current release: `sed -n 's/.*"version": "\(.*\)".*/\1/p' ${PACKAGE}`
    exit 1
fi
RELEASE=$1

# replaces version
sed -i '' 's/\(.*"version": "\)\(.*\)\(".*\)/\1'$RELEASE'\3/' ${PACKAGE}
# commits new version
git commit -am "$RELEASE"

# fetch all current tags
git fetch --tags

# generate boilerplate release notes from merged PR messages
RELEASE_NOTES="$(git log $(git describe --tags --abbrev=0)..HEAD --merges --pretty='* %b [%h](http://github.com/lightninglabs/lightning-app/commit/%H)\n')"

# ensure temp file is empty
rm -f ${TEMP_DATA_JSON}

DATA_JSON='{"tag_name": "'"$RELEASE"'", "name": "'"$RELEASE"'", "body": "'"$RELEASE_NOTES"'", "prerelease": true, "draft": true}'

echo "${DATA_JSON}" >> ${TEMP_DATA_JSON}

curl -H "Content-Type: application/json" \
  -H "Authorization: token $GH_TOKEN" \
  --data @$TEMP_DATA_JSON \
  $GITHUB_API_ENDPOINT

# cleanup
rm -f ${TEMP_DATA_JSON}
