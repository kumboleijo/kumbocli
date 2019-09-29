const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const git = require('simple-git');
const xa = require('xa');
const camelCase = require('camelcase');
const exec = require('child_process').exec;

const cwd = process.cwd();

let templatePath;
let destPath;
let configFilePath;
let packageJson;

async function kumbocli(options) {
  xa.info('hello kumbocli');

  xa.info('processing inputs...');
  await processPathAndConfigFile(options);
  xa.success('inputs processed');

  // create folder
  xa.info('creating folder...');
  if (!fs.existsSync(destPath)) fs.mkdirSync(destPath), xa.success(`created folder ${destPath}`);
  else xa.warning('folder already exists - all files will be overwritten!');

  // copy template files
  xa.info('copy template files...');
  await copyTemplateFiles(templatePath, destPath);
  xa.success('copied template files');

  // modify all .js files to fit the correct program name
  await renameSymbols(destPath);

  // git init
  git(destPath).init();

  xa.success('your project is all setup and ready to go!');
}

async function processPathAndConfigFile(options) {
  templatePath = path.resolve(__dirname + '/' + options.template);
  configFilePath = path.resolve(templatePath + '/package.json');

  let packageFile = fs.readFileSync(configFilePath);

  packageJson = JSON.parse(packageFile);

  // modify package.json properties
  packageJson.name = options.name == '' ? packageJson.name : options.name;
  packageJson.bin = options.name == '' ? 'bin/' + packageJson.name : 'bin/' + options.name;
  packageJson.description = options.description == '' ? packageJson.description : options.description;
  packageJson.author = options.author == '' ? packageJson.author : options.author;

  destPath = path.resolve(packageJson.name);
}

async function copyTemplateFiles(src, dest) {
  fs.copySync(src, dest, {
    filter: (src, dest) => {
      // xa.info('copying file: ' + path.basename(src));
      if (path.basename(src) == 'package.json') return false;
      else return true;
    }
  });

  // copy modified package.json to destPath
  fs.writeFileSync(destPath + '/package.json', JSON.stringify(packageJson));

  // rename excecutable
  fs.renameSync(destPath + '/bin/run', destPath + `/bin/${packageJson.name}`);

  // make it excecutable
  fs.chmodSync(`${packageJson.name}/bin/${packageJson.name}`, '755');
}

async function renameSymbols(dir) {
  // find all *.js files and rename the variables in that file
  glob(`${dir}/**/*.{js,md}`, (err, files) => {
    files.forEach(file => {
      let fileString = fs.readFileSync(file, 'utf-8');

      let mapObj = {
        REPLACEMENAMECAMELCASE: camelCase(packageJson.name),
        REPLACEMENAME: packageJson.name,
        REPLACEMEDESCRIPTION: packageJson.description
      };

      let re = new RegExp(Object.keys(mapObj).join('|'), 'g');
      fileStringModified = fileString.replace(re, matched => {
        return mapObj[matched];
      });
      fs.writeFileSync(file, fileStringModified);
    });
  });
}

module.exports = kumbocli;
