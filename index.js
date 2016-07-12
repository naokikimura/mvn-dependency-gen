#!/usr/bin/env node

const readline = require('readline');
const app = require('./app');

const rl = readline.createInterface({
  input: process.stdin
}).on('line', app.generate);