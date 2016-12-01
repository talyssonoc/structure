const testsContext = require.context('./unit', true, /\.spec\.js$/);

testsContext.keys().forEach((path) => {
  try {
    testsContext(path);
  } catch(err) {
    console.error('[ERROR] WITH SPEC FILE: ', path);
    console.error(err);
  }
});
