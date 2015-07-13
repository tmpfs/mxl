var info = console.info;

process.chdir('test/fixtures/conf');

before(function(done) {
  //info('before each')
  console.info = function(){};
  done();
});

after(function(done) {
  //info('before each')
  console.info = info;
  done();
});
