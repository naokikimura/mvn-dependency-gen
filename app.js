const crypto = require('crypto');
const debug = require('debug')('mvn-dependency-gen:app');
const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const request = require('request-promise');
const util = require('util');

module.exports.generate = line => {
  debug(`Received: ${line}`);
  const filename = line.trim();
  return digest(filename)
    .then(digest => {
      debug(`SHA1(${filename})= ${digest}`);
      const query = { q: `1:"${digest}"`, rows: 20, wt: 'json' };
      const baseurl = 'http://search.maven.org/solrsearch/select';
      const url = `${baseurl}?${querystring.stringify(query)}`;
      debug(`url: ${url}`);
      return request({ uri: url, json: true });
    })
    .then(result => {
      debug(`result: ${util.inspect(result)}`);
      const response = result.response || {};
      const dependencies = response.numFound
        ? transformToDependency(response.docs)
        : transformToSystemScopeDependency(filename);
      debug(`dependencies: ${util.inspect(dependencies)}`);
      return dependencies;
    });
};

function digest(filename, algorithm, encoding) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm || 'sha1');
    fs.createReadStream(filename)
      .on('end', () => resolve(hash.digest(encoding || 'hex')))
      .on('error', reject)
      .pipe(hash, { end: false });
  });
}
module.exports.digest = digest;

function transformToDependency(docs) {
  return docs.map(doc => {
    return {
      groupId: [doc.g],
      artifactId: [doc.a],
      version: [doc.v]
    }
  });
}
module.exports.transformToDependency = transformToDependency;

function transformToSystemScopeDependency(filename) {
  const basename = path.basename(filename, '.jar');
  const [artifactId, version] = basename.split(/-([^-]*$)/, 2);
  const systemPath = path.isAbsolute(filename) ? filename : ['${basedir}', filename].join(path.sep);
  return [
    {
      groupId: [artifactId],
      artifactId: [artifactId],
      version: [version || 'unknown'],
      scope: ['system'],
      systemPath: [systemPath]
    }
  ];
}
module.exports.transformToSystemScopeDependency = transformToSystemScopeDependency;