var info = console.info;
process.chdir('test/fixtures/conf');

before(function(done) {
  console.info = function(){};
  done();
});

after(function(done) {
  console.info = info;
  done();
});
