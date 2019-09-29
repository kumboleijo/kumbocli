var inquirer = require('inquirer');
const program = require('commander');

const pjson = require('../package.json');

const REPLACEMENAMECAMELCASE = require('./main');

function cli(argv) {
  program.version(pjson.version).description(pjson.description);

  program.parse(argv);

  /*
   * Un-comment the following lines to enable prompting for user inputs
   */
  // inquirer.prompt([{ name: 'name', message: 'Enter a name.', default: 'none' }]).then(answers => {
  //   console.log(answers);
  // });

  REPLACEMENAMECAMELCASE(argv);
}

module.exports = cli;
