const fs = require('fs');
const path = require('path');

const colors = require('colors');

const packagesFolder = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesFolder);

packages.forEach((p) => {
  const packagePath = path.join(__dirname, '..', 'packages', p);

  [
    '.commitlintrc.js',
    '.dependency-cruiser.js',
    '.editorconfig',
    '.eslintrc.js',
    '.jscpd.json',
    '.mocharc.js',
    '.prettierrc.js',
  ].forEach((f) => {
    console.log(`Copying '${f}' to ${packagePath}`.blue);
    fs.writeFileSync(path.join(packagePath, f), fs.readFileSync(path.join(__dirname, '..', f)));
  });

  const localPackageJsonTemplateFile = path.join(packagePath, 'package.template.json');
  const localPackageJsonFile = path.join(packagePath, 'package.json');
  const metaPackageJsonTemplateFile = path.join(__dirname, '..', 'package.template.json');

  try {
    console.log(`Completing ${localPackageJsonFile} file`.green);

    let version = '0.0.1';
    try {
      version = JSON.parse(fs.readFileSync(localPackageJsonFile)).version;
    } catch (e) {
      process.env.DEBUG && console.log(e)
    }

    const localPackageJson = JSON.parse(fs.readFileSync(localPackageJsonTemplateFile));
    const metaPackageJson = JSON.parse(fs.readFileSync(metaPackageJsonTemplateFile));

    for (const key of Object.keys(localPackageJson)) {
      switch (true) {
        case Array.isArray(localPackageJson[key]):
          metaPackageJson[key] = [...(metaPackageJson[key] || []), ...localPackageJson[key]];
          break;
        case typeof localPackageJson[key] === 'object':
          metaPackageJson[key] = {
            ...(metaPackageJson[key] || {}),
            ...localPackageJson[key],
          };
          break;
        default:
          metaPackageJson[key] = localPackageJson[key];
      }
    }

    metaPackageJson.version = version;
    fs.writeFileSync(localPackageJsonFile, JSON.stringify(metaPackageJson, null, 2));
  } catch (e) {
    process.env.DEBUG && console.log(e)
    console.log(`No local template found in ${packagePath}`.yellow);
  }
});
