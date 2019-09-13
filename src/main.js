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

async function copyTemplateFiles(src, dest) {
    fs.copySync(src, dest, {
        filter: (src, dest) => {
            if (path.basename(src) == 'package.json') return false;
            else return true;
        }
    });
}

async function rename(dir) {
    glob(`${dir}/**/*.js`, (err, jsFiles) => {
        jsFiles.forEach(jsFile => {
            console.log(jsFile);
            readFile(jsFile, 'utf-8').then(jsFileString => {
                let jsFileStringModified = jsFileString.replace(/\$REPLACEME/g, 'test');
                writeFile(jsFile, jsFileStringModified).then(res => {}, err => {});
            });
        });
    });
    // let files = fs.readdirSync(dir);
    // console.log(files);

    // let jsFiles = files.filter(file => path.extname(file) == '.js');
    // jsFiles.forEach(jsFile => {
    //     console.log(jsFile);
    // });
}

async function kumbocli(options) {
    xa.info('hello kumbocli');

    let templatePath = path.resolve(__dirname + '/' + options.template);
    let config = path.resolve(templatePath + '/package.json');

    let package = await readFile(config);
    let packageJson = JSON.parse(package);

    packageJson.name = options.name == '' ? packageJson.name : options.name;
    packageJson.bin = options.name == '' ? 'bin/' + packageJson.name : 'bin/' + options.name;
    packageJson.description = options.description == '' ? packageJson.description : options.description;
    packageJson.author = options.author == '' ? packageJson.author : options.author;

    // console.log(packageJson);

    // create folder
    if (!fs.existsSync(packageJson.name)) fs.mkdirSync(packageJson.name), xa.success(`created folder ${packageJson.name}`);

    // copy template files
    await copyTemplateFiles(templatePath, path.resolve(packageJson.name));

    // copy modified package.json
    await writeFile(path.resolve(packageJson.name) + '/package.json', JSON.stringify(packageJson));

    await rename(path.resolve(packageJson.name));
    // git init
    git(path.resolve(packageJson.name)).init();
}
module.exports = kumbocli;
