const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const glob = require('glob');
const { execFile } = require('child_process');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const git = require('simple-git');
const xa = require('xa');

const cwd = process.cwd();

let templatePath;
let destPath;
let configFilePath;
let packageJson;

async function kumbocli(options) {
    xa.info('hello kumbocli');

    xa.info('processing inputs...');
    await processPathAndConfigFile(options);
    xa.success('processing inputs');

    // create folder
    xa.info('creating folder...');
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath), xa.success(`created folder ${destPath}`);
    else xa.warning('folder already exists - all files will be overwritten!');

    // copy template files
    xa.info('copy template files...');
    await copyTemplateFiles(templatePath, destPath);

    // process.exit(1);

    // modify all .js files to fit the correct program name
    await renameSymbols(destPath);

    // git init
    git(destPath).init();
}

async function processPathAndConfigFile(options) {
    templatePath = path.resolve(__dirname + '/' + options.template);
    configFilePath = path.resolve(templatePath + '/package.json');

    let packageFile = await readFile(configFilePath);

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
            xa.success('copy file: ');
            if (path.basename(src) == 'package.json') return false;
            else return true;
        }
    });

    // copy modified package.json to destPath
    await writeFile(destPath + '/package.json', JSON.stringify(packageJson));

    // rename excecutable
    fs.renameSync(destPath + '/bin/run', destPath + `/bin/${packageJson.name}`);
}

async function renameSymbols(dir) {
    // find all *.js files and rename the variables in that file
    glob(`${dir}/**/*.js`, (err, jsFiles) => {
        jsFiles.forEach(jsFile => {
            console.log(jsFile);
            readFile(jsFile, 'utf-8').then(jsFileString => {
                let jsFileStringModified = jsFileString.replace(/\$REPLACEME/g, 'test');
                writeFile(jsFile, jsFileStringModified).then(res => {}, err => {});
            });
        });
    });
}

module.exports = kumbocli;
