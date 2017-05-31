const invariant = require('invariant');

module.exports = serializeFunc;

function serializeFunc(x) {
  if (typeof x === 'string') {
    return { path: x };
  }
  else if (typeof x === 'function') {
    // console.log(getModuleChain(module))

    return {
      // TODO: we need to find a dynamic way to reach the caller module that is
      // outside of the package.. maybe use stack-trace?
      // filename: module.filename,
      source: x.toString()
    }
  }
  else {
    invariant(false, "Don't know how to serialize functions of this type.")
  }
}

serializeFunc.asyncified = function(x) {
  return Object.assign(serializeFunc(x), { asyncify: true })
}

// function getModuleChain(x) {
//   if (!x.parent) {
//     return [ x.filename ];
//   }

//   return [ x.filename ].concat(getModuleChain(x.parent));
// }