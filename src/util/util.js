const fetch = require("node-fetch");

const Util = {
  promiseBatchPerformer: function(arr, method) {
    if (arr.length === 0) {
      return new Promise((resolve, reject) => { resolve() });
    }
    return Util._promiseBatchPerformer(arr, 0, method);
  },

  _promiseBatchPerformer: function(arr, index, method) {
    return new Promise((resolve, reject) => {
      if (index < arr.length) {
        method(arr[index])
          .then(() => {
            return Util._promiseBatchPerformer(arr, index+1, method);
          })
          .then(() => {
            resolve()
          })
          .catch((err) => reject(err))
      }
      else {
        resolve();
      }
    })
  },

  wait: function(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, ms);
    })
  },

  post: function(endpoint, timeoutSeconds= 2) {
    return request("POST", endpoint, timeoutSeconds)
  },

  get: function(endpoint, timeoutSeconds= 2) {
    return request("GET", endpoint, timeoutSeconds)
  }

}

module.exports = Util;

function request(method, endpoint, timeoutSeconds= 2) {
  return new Promise((resolve, reject) => {
    let config = {method: method};

    let timeout = setTimeout(() => {
      reject("TIMEOUT")
    }, timeoutSeconds*1000)

    fetch(endpoint, config)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        clearTimeout(timeout)
        resolve(json)
      })
      .catch((err) => {
        clearTimeout(timeout)
        reject(err);
      })
  })
}