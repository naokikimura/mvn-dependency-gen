#!/usr/bin/env node

const debug = require('debug')('mvn-dependency-gen:app');
const fs = require('fs');
const minimist = require('minimist');
const readline = require('readline');
const util = require('util');
const xml2js = require('xml2js');

const app = require('./app');

function load(pom) {
  return new Promise((resolve, reject) => {
    fs.readFile(options.pom, (err, xml) => err ? reject(err) : resolve(xml));
  }).then(xml => new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(xml, (err, result) => err ? reject(err) : resolve(result));
  }));
}

const options = minimist(process.argv.slice(2), { default: app.defaultOptions });
debug(`options: ${util.inspect(options)}`);

(options.pom ? load(options.pom) : Promise.resolve(null))
  .then(pom => {
    debug(`pom: ${util.inspect(pom, { depth: 4 })}`);
    const promises = [];
    const builder = new xml2js.Builder({
      rootName: 'dependency',
      headless: true,
      renderOpts: { pretty: false }
    });
    const rl = readline.createInterface({ input: process.stdin })
      .on('line', line => {
        const promise = app.generate(line, options)
          .then(pom
            ? dependencies => dependencies.map(dependency => ({ dependency: dependency }))
            : dependencies => {
              dependencies
                .map(builder.buildObject.bind(builder))
                .forEach(xml => console.log(xml));
            })
          .catch(err => {
            debug(util.inspect(err));
            console.error(err.message);
            process.exit(1);
          });
        promises.push(promise);
      })
      .on('close', pom ? () => {
        Promise.all(promises).then(results => {
          debug(`results: ${util.inspect(results, { depth: 3 })}`);
          pom.project.dependencies = [{
            dependency: results
              .reduce((previous, current) => previous.concat(current), pom.project.dependencies || [])
              .reduce((previous, current) => previous.concat(current.dependency), [])
          }];
          const builder = new xml2js.Builder();
          console.log(builder.buildObject(pom));
        });
      } : () => { });
  })
  .catch(err => {
    debug(util.inspect(err));
    console.error(err.message);
    process.exit(1);
  });