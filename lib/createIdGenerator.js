module.exports = function createIdGenerator() {
  let counter = 0;

  return function generateId() {
    return String(++counter);
  }
}