function before(info, req, next) {
  var unparsed = info.args
    , dirs = []
    , files = []
    , profiles = [];

  console.dir(unparsed);

  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    profiles: profiles,
    all: this.all === true
  }


  next();
}

module.exports = before;
