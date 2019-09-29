var inquirer = require('inquirer');
const program = require('commander');

const pjson = require('../package.json');

const kumbocli = require('./main');

function cli(argv) {
  program
    .version(pjson.version)
    .description(pjson.description)
    .option('-n, --name <NAME>', 'set the name of the new CLI app', 'my-kumbocli-app')
    .option('-d, --description <DESC>', 'set the description', 'Made with kumbocli.')
    .option('-a, --author <AUTHOR>', 'set the author', 'Kumboleijo')
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
        default: program.description
      },
      {
        name: 'author',
        message: 'Who is the author of this CLI app?',
        default: program.author
      },
      {
        name: 'template',
        message: 'Which template do you want to use?',
        type: 'list',
        choices: ['data/templates/default-cli']
      }
    ])
    .then(answers => {
      console.log('\n');
      console.log(answers);
      console.log('\n');

      // process.exit(1);
      kumbocli(answers);
    });
}

module.exports = cli;
