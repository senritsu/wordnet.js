'use strict'
//business logic for loading, unzipping the data
exports.load_or_unzip = function(callback) {

  let load_data = function() {
    return {
      noun: require("./data/Noun").data,
      adjective: require("./data/Adjective").data,
      verb: require("./data/Verb").data,
      adverb: require("./data/Adverb").data,
    }
  }
  
  let o = load_data()
  callback(o)
}

exports.unique = function(a) {
  return a.reduce(function(p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);
};

exports.flatten = function(arr) {
  arr = arr || []
  return arr.reduce(function(a, b) {
    return a.concat(b);
  }, []);
}
