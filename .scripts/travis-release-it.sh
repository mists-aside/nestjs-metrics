#! /bin/bash
set -xe

git config user.email "travis@travis-ci.org"
git config user.name "Travis CI"

git remote rm origin
git remote add origin https://${GH_TOKEN}@github.com/mists-aside/nestjs-metrics.git
git symbolic-ref HEAD refs/heads/master
# git checkout master
# git branch --set-upstream-to=origin/master master

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

git status

npm run release -- patch --no-git.requireUpstream #--dry-run

npm release
