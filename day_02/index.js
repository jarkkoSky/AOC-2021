const R = require('ramda');
const fs = require('fs');

const data = R.compose(
  R.map((pair) => [pair[0], parseInt(pair[1])]),
  R.map(R.split(' ')),
  R.split('\n'),
  R.toString,
  fs.readFileSync
)('./input.txt');

const part1 = () => {
  let horizontalPos = 0;
  let depth = 0;

  R.map((pair) => {
    switch (pair[0]) {
      case 'down':
        depth += pair[1];
        break;
      case 'up':
        depth += R.negate(pair[1]);
        break;
      case 'forward':
        horizontalPos += pair[1];
    }
  }, data);

  console.log('Result is', horizontalPos * depth);
};

const part2 = () => {
  let horizontalPos = 0;
  let aim = 0;
  let depth = 0;

  R.map((pair) => {
    switch (pair[0]) {
      case 'down':
        aim += pair[1];
        break;
      case 'up':
        aim += R.negate(pair[1]);
        break;
      case 'forward':
        horizontalPos += pair[1];
        depth += R.multiply(aim, pair[1]);
    }
  }, data);

  console.log('Result is', horizontalPos * depth);
};

part1();
part2();
