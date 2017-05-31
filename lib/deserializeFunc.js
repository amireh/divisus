const invariant = require('invariant');
const Module = require('module');
const path = require('path');
const { asyncify } = require('async');

module.exports = x => maybeAsyncify(x)(deserializeFunc(x));

function deserializeFunc(x) {
  if (isInlineFunction(x)) {
    return compileModule(`module.exports = ${x.source}`, { filename: x.filename });
  }
  else if (isModule(x)) {
    return require(x.path);
  }
  else if (isFunction(x)) {
    return x;
  }
  else {
    invariant(false, "Don't know how to deserialize this function.")
  }
}

function maybeAsyncify(spec) {
  return function(f) {
    if (spec.asyncify) {
      return asyncify(f);
    }
    else {
      return f;
    }
  }
}

function compileModule(code, options) {
  invariant(typeof code === 'string', `Code must be a string, not "${typeof code}"`)

  const filename = options.filename || '';
  const paths = Module._nodeModulePaths(path.dirname(filename));
  const childModule = new Module(filename, module.parent);

  childModule.filename = filename;
  childModule.paths = paths;
  childModule._compile(code, filename);

  return childModule.exports;
}

function isInlineFunction(x) {
  return x && typeof x === 'object' && typeof x.source === 'string';
}

function isModule(x) {
  return x && typeof x === 'object' && typeof x.path === 'string';
}

function isFunction(x) {
  return typeof x === 'function';
}