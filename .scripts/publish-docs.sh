#! /bin/bash
set -xe

# https://gist.github.com/willprice/e07efd73fb7f13f917ea

npm run docs

git clone https://${GH_TOKEN}@github.com/mists-aside/mists-aside.github.io

rm -rf mists-aside.github.io/$1
cp -rdf docs mists-aside.github.io/$1

cd mists-aside.github.io

git config user.email "travis@travis-ci.org"
git config user.name "Travis CI"

git add .
git commit --message "Travis build $TRAVIS_BUILD_NUMBER :: $1 Docs"

git push --quiet --set-upstream origin master

cd ..
rm -rf mists-aside.github.io
