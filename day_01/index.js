const R = require('ramda');
const fs = require('fs');

const data = R.compose(
  R.map(parseInt),
  R.split('\n'),
  R.toString,
  fs.readFileSync
)('input.txt');

R.compose(
  (x) => console.log('Answer 1 is', x),
  R.length,
  R.filter((pair) => pair[1] > pair[0]),
  R.aperture(2)
)(data);

R.compose(
  (x) => console.log('Answer 2 is', x),
  R.length,
  R.filter((pair) => pair[1] > pair[0]),
  R.aperture(2),
  R.map(R.sum),
  R.aperture(3)
)(data);
