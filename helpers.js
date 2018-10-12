export function unique(a) {
  return a.reduce(function(p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);
};

export function flatten(arr) {
  arr = arr || []
  return arr.reduce(function(a, b) {
    return a.concat(b);
  }, []);
}
