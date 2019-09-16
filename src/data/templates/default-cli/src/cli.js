var inquirer = require('inquirer');
const program = require('commander');
const pjson = require('../package.json');

const $REPLACEME = require('./main');

function cli(argv) {
    program.version(pjson.version).description(pjson.description);

    program.parse(argv);

    $REPLACEME(argv);
}

module.exports = cli;
