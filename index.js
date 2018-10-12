import {unique, flatten} from './helpers.js'
import data from './data/index.js'

function fast_search (str, k) {
  let founds = []
  let l = data[k].length;
  for (let i = 0; i < l; i++) {
    for (let o = 0; o < data[k][i].words.length; o++) {
      if (data[k][i].words[o] === str) {
        founds.push(data[k][i])
        break
      }
    }
  }
  return founds
}

function is_id (str) {
  return str.match(/[a-z]\.(adjective|verb|noun|adverb)\.[0-9]/i) !== null
}

function id_lookup (id, k) {
  let l = data[k].length;
  for (let i = 0; i < l; i++) {
    if (data[k][i].id === id) {
      return [data[k][i]]
    }
  }
  return null
}

function lookup (str, k) {
  //given an id
  if (is_id(str)) {
    let type = str.match(/[a-z]\.(adjective|verb|noun|adverb)\.[0-9]/i)[1]
    return id_lookup(str, type)
  }
  //given a pos
  if (k) {
    if (str) {
      return fast_search(str, k)
    }
    return data[k]
  }
  //else, lookup in all types
  let types = ["adverb", "adjective", "verb", "noun"]
  let all = []
  for (let i = 0; i < types.length; i++) {
    all = all.concat(fast_search(str, types[i]))
  }
  return all
}

const api = {
  lookup,
  data,
  adverb(s) {
    return lookup(s, "adverb")
  },
  adjective(s) {
    return lookup(s, "adjective")
  },
  verb(s) {
    return lookup(s, "verb")
  },
  noun(s) {
    return lookup(s, "noun")
  },
  synonyms(s) {
    return lookup(s, "adjective").map(function(syn) {
      let loose = syn.similar.map(function(id) {
        return lookup(id, "adjective")[0].words
      })
      return {
        synset: syn.id,
        close: syn.words.filter(function(w) {
          return w !== s
        }),
        far: flatten(loose).filter(function(w) {
          return w !== s
        })
      }
    })
  },
  antonyms(s) {
    let ants = lookup(s, "adjective").map(function(syn) {
      return syn.antonym
    })
    ants = unique(flatten(ants))
    let all = ants.map(function(id) {
      return lookup(id, "adjective")[0]
    })
    return all
  },
  pos(s) {
    return unique(lookup(s).map(function(syn) {
      return syn.syntactic_category
    }))
  },
  words(cb) {
    let keys=Object.keys(data)
    let words={}
    for (let i=0; i<keys.length; i++){
      for (let o=0; o<data[keys[i]].length; o++){
        for (let w=0; w<data[keys[i]][o].words.length; w++){
          words[data[keys[i]][o].words[w]]=true
        }
      }
    }
    cb(Object.keys(words).sort())
  }
}

export default api