const R = require('ramda');

// a version of R.ifElse that doesn't curry the function...
const ifElse = R.curry((p, f, g) => (...args) => {
  if (R.apply(p, args)) {
    R.apply(f, args);
  }
  else {
    R.apply(g, args)
  }
})

module.exports = ifElse;