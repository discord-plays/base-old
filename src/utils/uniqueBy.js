function uniqueBy(a, key) {
  var seen = {};
  return a.filter(function(item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

module.exports = uniqueBy;
