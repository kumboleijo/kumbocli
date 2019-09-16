var inquirer = require('inquirer');
const program = require('commander');
const pjson = require('../package.json');

const kumbocli = require('./main');

function cli(argv) {
    program
        .version(pjson.version)
        .description(pjson.description)
        .option('-n, --name <NAME>', 'set the name of the new CLI app', '')
        .option('-d, --description <DESC>', 'set the description', '')
        .option('-a, --author', 'set the author', '')
        .option('-t, --template <TEMPLATE>', 'set the directory of the template', 'data/templates/default-cli');

    program.parse(argv);

    inquirer
        .prompt([
            {
                name: 'name',
                message: 'What is the name of the CLI app?',
                default: program.name
            },
            {
                name: 'description',
                message: 'What is the description of the CLI app?',
                default: program.description ? program.description : 'Made with kumbocli.'
            },
            {
                name: 'author',
                message: 'Who is the author of this CLI app?',
                default: program.author ? program.author : 'kumboleijo'
            },
            {
                name: 'template',
                message: 'Which template do you want to use?',
                default: program.template
            }
        ])
        .then(answers => {
            console.log('\n');
            console.log(answers);
            console.log('\n');
            kumbocli(answers);
        });
}

module.exports = cli;
