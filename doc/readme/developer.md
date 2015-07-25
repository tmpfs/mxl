## Developer

Clone the repository, install deps (`npm i`) and symlink the executable in `$PATH`.

Install [vim-tmux][] if possible, it's very useful.

When `NODE_ENV` is set to `devel` error stack traces are printed and man pages may be generated dynamically (`NODE_ENV=devel mxl help`).

### Test

To run the test suite:

```
npm test
```

Note that the working directory for test execution is set to [fixtures/conf](/test/fixtures/conf).

Run an individual test spec with `TEST_SPEC`:

```
TEST_SPEC=test/spec/context npm test
```

### Cover

To generate code coverage:

```
npm run cover
```

### Alias

To rebuild the default rc file aliases from the files in [tpl](/conf/tpl) run:

```
npm run alias
```

This is automatically called on `postinstall` to ensure shipped aliases are correct.

### Docs

To build all documentation:

```
npm run docs
```

### Manual

To build all man pages (requires [manpage][]):

```
npm run manual
```

### Readme

To build the readme file from the partial definitions (requires [mdp][]):

```
npm run readme
```
