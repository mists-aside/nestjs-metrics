
rm -rf .github/ISSUE_TEMPLATE .github/PULL_REQUEST_TEMPLATE
cp -rdf .gitlab/issue_templates .github/ISSUE_TEMPLATE
cp -rdf .gitlab/merge_request_templates .github/PULL_REQUEST_TEMPLATE
