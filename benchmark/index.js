const suites = require('require-dir')();

Object.keys(suites).forEach((suite) => {
  suites[suite]
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
