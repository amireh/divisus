#!/usr/bin/env node

const createWorker = require('./createWorker');

createWorker(process);

process.stdin.resume();