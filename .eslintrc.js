module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
  },
  "plugins": [
    "mocha"
  ],

  "rules": {
    "mocha/no-exclusive-tests": 2,
    "no-console": 0,
    "no-unexpected-multiline": 0
  }
};