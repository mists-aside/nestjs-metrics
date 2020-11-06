#! /bin/bash
set -xe

git remote rm origin
git remote add origin https://${GH_TOKEN}@github.com/mists-aside/nestjs-metrics.git
git symbolic-ref HEAD refs/heads/master
git branch --set-upstream-to=origin/master master

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

git status

npm run release -- patch --dry-run
