#! /bin/bash
set -xe

git remote rm origin
git remote add origin https://dragoscirjan:${GH_TOKEN}@github.com/mists-aside/nestjs-metrics.git
git symbolic-ref HEAD refs/heads/master

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

npm run release -- patch --dry-run
