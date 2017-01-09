const Benchmark = require('benchmark');
const suites = require('./suites');

suites.forEach((suiteData) => {
  var suite = new Benchmark.Suite(suiteData.name);

  suite = suiteData.cases.reduce((s, c) => {
    return s.add(c.name, c.fn);
  }, suite);

  suite
    .on('start', function() {
      // eslint-disable-next-line no-console
      console.log(`# ${this.name}:`);
    })

    .on('cycle', (event) => {
      // eslint-disable-next-line no-console
      console.log(String(event.target));
    })

    .on('complete', () => {
      // eslint-disable-next-line no-console
      console.log('\n=========\n');
    })

    .run(true);
});
