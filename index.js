#!/usr/bin/env node

const debug = require('debug')('mvn-dependency-gen:app');
const minimist = require('minimist');
const readline = require('readline');
const util = require('util');
const xml2js = require('xml2js');

const app = require('./app');

const builder = new xml2js.Builder({
  rootName: 'dependency',
  headless: true,
  renderOpts: { pretty: false }
});

const options = minimist(process.argv.slice(2), { default: app.defaultOptions });
debug(`options: ${util.inspect(options)}`);

const rl = readline.createInterface({
  input: process.stdin
}).on('line', line => {
  app.generate(line, options)
    .then(dependencies => {
      dependencies
        .map(builder.buildObject.bind(builder))
        .forEach(xml => console.log(xml));
    }).catch(err => {
      debug(util.inspect(err));
      console.error(err.message);
      process.exit(1);
    });
});