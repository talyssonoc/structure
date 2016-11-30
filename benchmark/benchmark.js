const Benchmark = require('benchmark');
const suites = require('./suites');

suites.forEach((suiteData) => {
  var suite = new Benchmark.Suite(suiteData.name);

  suite = suiteData.cases.reduce((s, c) => {
    return s.add(c.name, c.fn);
  }, suite);

  suite
    .on('start', function() {
      console.log(`# ${this.name}:`);
    })

    .on('cycle', (event, bench) => {
      console.log(String(event.target));
    })

    .on('complete', () => {
      console.log('\n=========\n');
    })

    .run(true);
});
