const crypto = require('crypto');
const debug = require('debug')('search-dependency')
const fs = require('fs');
const readline = require('readline');
const util = require('util');

const rl = readline.createInterface({
  input: process.stdin
}).on('line', line => {
  debug(`Received: ${line}`);
  const filename = line.trim();
  digest(filename)
    .then(digest => console.log(`SHA1(${filename})= ${digest}`))
    .catch(err => {
      debug(util.inspect(err));
      console.error(err.message);
      process.exit(1);
    });
});

function digest(filename, algorithm, encoding) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm || 'sha1');
    fs.createReadStream(filename)
      .on('end', () => resolve(hash.digest(encoding || 'hex')))
      .on('error', reject)
      .pipe(hash, { end: false });
  });
}