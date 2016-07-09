const crypto = require('crypto');
const debug = require('debug')('search-dependency')
const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const util = require('util');
const xml2js = require('xml2js')

const rl = readline.createInterface({
  input: process.stdin
}).on('line', line => {
  debug(`Received: ${line}`);
  const filename = line.trim();
  digest(filename)
    .then(digest => {
      debug(`SHA1(${filename})= ${digest}`);
      const query = { q: `1:"${digest}"`, rows: 20, wt: 'json' };
      const baseurl = 'http://search.maven.org/solrsearch/select';
      const url = `${baseurl}?${querystring.stringify(query)}`;
      return new Promise((resolve, reject) => http.get(url, resolve).on('error', reject));
    })
    .then(response => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        response
          .on('data', chunks.push.bind(chunks))
          .on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))))
          .on('error', reject);
      });
    })
    .then(result => {
      debug(`result: ${result}`);
      const response = result.response || {};
      debug(`numFound: ${response.numFound}`);
      const dependencies = response.numFound ?
        response.docs.map(doc => {
          return {
            groupId: [doc.g],
            artifactId: [doc.a],
            version: [doc.v]
          }
        }) : (filename => {
          const basename = path.basename(filename, '.jar');
          const [artifactId, version] = basename.split(/-([^-]*$)/, 2);
          const systemPath = path.isAbsolute(filename) ? filename : ['${basedir}', filename].join(path.sep);
          return [
            {
              groupId: [artifactId],
              artifactId: [artifactId],
              version: [version],
              scope: ['system'],
              systemPath: [systemPath]
            }
          ];
        })(filename);
      debug(`dependencies: ${util.inspect(dependencies)}`);
      const builder = new xml2js.Builder({ rootName: 'dependency', headless: true, renderOpts: { pretty: false } });
      dependencies.forEach(dependency => console.log(builder.buildObject(dependency)));
    })
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