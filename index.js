const path = require('path');
const fs = require('fs');
const elmCompiler = require('node-elm-compiler');
const cmdExists = require('command-exists').sync;

const namespace = 'elm';
const fileFilter = /\.elm$/;

const fileExists = p => fs.existsSync(p) && fs.statSync(p).isFile();

const getPathToElm = () => {
  if (fileExists('./node_modules/.bin/elm')) return './node_modules/.bin/elm'
  if (cmdExists('elm')) return 'elm'

  throw new Error('Could not find `elm` executable. You can install it with `yarn add elm` or `npm install elm`')
};

const toBuildError = error => ({ text: error.message });

module.exports = (config = {}) => ({
  name: 'elm',
  setup(build) {
    const isProd = process.env.NODE_ENV === 'production'

    const { optimize = isProd, debug, clearOnWatch } = config
    const pathToElm = config.pathToElm || getPathToElm();

    const compileOptions = {
      pathToElm,
      optimize,
      processOpts: { stdout: 'pipe' },
      debug,
    };

    build.onResolve({ filter: fileFilter }, async (args) => {
      const resolvedPath = path.join(args.resolveDir, args.path)
      const resolvedDependencies = await elmCompiler.findAllDependencies(resolvedPath)

      return ({
        path: path.join(args.resolveDir, args.path),
        namespace,
        watchFiles: [resolvedPath, ...resolvedDependencies]
      })
    })

    build.onLoad({ filter: /.*/, namespace }, async args => {
      if (clearOnWatch) {
        console.clear();
      }

      try {
        const contents = elmCompiler.compileToStringSync([args.path], compileOptions);

        return { contents };
      } catch (e) {
        return { errors: [toBuildError(e)] };
      }
    });
  },
});
