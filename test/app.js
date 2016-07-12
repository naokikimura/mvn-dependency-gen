const debug = require('debug')('mvn-dependency-gen:test:app');
const expect = require('chai').expect;
const app = require('../app');

describe('app#generate', () => {

});

describe('app#digest', () => {

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

});