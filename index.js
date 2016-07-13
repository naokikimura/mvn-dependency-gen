#!/usr/bin/env node

const readline = require('readline');
const app = require('./app');
const xml2js = require('xml2js');

const builder = new xml2js.Builder({
  rootName: 'dependency',
  headless: true,
  renderOpts: { pretty: false }
});

const rl = readline.createInterface({
  input: process.stdin
}).on('line', line => {
  app.generate(line)
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