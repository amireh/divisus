module.exports = function deserializeError(x) {
  if (typeof x === 'string') {
    return deserializeErrorFromJSON(x);
  }
  else {
    return x;
  }
};

function deserializeErrorFromJSON(errorString) {
  let errorData = null;

  try {
    errorData = JSON.parse(errorString);
  }
  catch (e) {
    // error wasn't a json string, just return it
    return new Error(errorString);
  }

  return Object.keys(errorData).reduce((error, key) => {
    error[key] = errorData[key];

    return error;
  }, new Error());
}