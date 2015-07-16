function uniq(value, index, self) { 
  return self.indexOf(value) === index;
}

module.exports = uniq;
