// .mocharc.js

module.exports = {
    recursive: true,
    reporter: 'spec',
    timeout: 5000,
    require: [
        'chai/register-assert',  // Using Assert style
        'chai/register-expect',  // Using Expect style
        'chai/register-should',  // Using Should style
        'ts-node/register',
    ]
};
