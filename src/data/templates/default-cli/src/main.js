const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const glob = require('glob');
const xa = require('xa');

const cwd = process.cwd();

async function REPLACEMENAMECAMELCASE(options) {
  xa.success('Hello REPLACEMENAMECAMELCASE!');
}

module.exports = REPLACEMENAMECAMELCASE;
