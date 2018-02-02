const debug = require('debug')('mvn-dependency-gen:test:app');
const expect = require('chai').expect;
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('request');

const app = require('../app');

const filename = path.join(os.tmpdir(), 'log4j-1.2.17.jar');
debug(`filename: ${filename}`);

before(done => {
  const out = fs.createWriteStream(filename)
    .on('error', done)
    .on('close', () => done());
  request
    .get('http://repo1.maven.org/maven2/log4j/log4j/1.2.17/log4j-1.2.17.jar')
    .on('response', response => {
      debug(`response.statusCode: ${response.statusCode}`);
    })
    .on('error', done)
    .pipe(out);
});

describe('app#generate', () => {
  it('Dependency要素を生成する', done => {
    const expected = [{
      groupId: ['log4j'],
      artifactId: ['log4j'],
      version: ['1.2.17']
    }];
    app.generate(filename).then(actual => {
      expect(actual).to.eql(expected);
      done();
    }).catch(done);
  });
  it('オフラインでDependency要素を生成する', done => {
    const expected = [{
      groupId: ['log4j'],
      artifactId: ['log4j'],
      version: ['1.2.17'],
      scope: ['system'],
      systemPath: [[filename].join(path.sep)]
    }];
    app.generate(filename, { offline: true }).then(actual => {
      expect(actual).to.eql(expected);
      done();
    }).catch(done);
  });
});

describe('app#digest', () => {
  it('SHA1チェックサムを計算する', done => {
    const expected = '5af35056b4d257e4b64b9e8069c0746e8b08629f';
    app.digest(filename).then(actual => {
      expect(actual).to.equal(expected);
      done();
    }).catch(done);
  });
});

describe('app#transformToDependency', () => {
  it('Dependencyに変換する', done => {
    const expected = [{
      groupId: ['log4j'],
      artifactId: ['log4j'],
      version: ['1.2.17']
    }];
    const docs = [{
      id: 'log4j:log4j:1.2.17',
      g: 'log4j',
      a: 'log4j',
      v: '1.2.17',
      p: 'bundle',
      timestamp: 1338025419000,
      tags: ['apache', 'log4j'],
      ec: ['-sources.jar', '-javadoc.jar', '.jar', '.zip', '.tar.gz', '.pom']
    }];
    const actual = app.transformToDependency(docs);
    expect(actual).to.eql(expected);
    done();
  });
});

describe('app#transformToSystemScopeDependency', () => {
  it('systemスコープのDependencyに変換する', done => {
    const filename = ['.', 'foo', 'bar-0.1.2.jar'].join(path.sep);
    const expected = [{
      groupId: ['bar'],
      artifactId: ['bar'],
      version: ['0.1.2'],
      scope: ['system'],
      systemPath: [['${basedir}', filename].join(path.sep)]
    }];
    const actual = app.transformToSystemScopeDependency(filename);
    expect(actual).to.eql(expected);
    done();
  });
});