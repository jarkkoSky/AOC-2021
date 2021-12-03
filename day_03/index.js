const R = require('ramda');
const fs = require('fs');

const data = R.compose(
  R.split('\r\n'),
  R.toString,
  fs.readFileSync
)('./input.txt');

// Part 1
let gammaRate = '';
let epsilonRate = '';

R.times((i) => {
  let one = 0;
  let zero = 0;

  R.map((binary) => {
    const bit = binary[i];

    if (bit == '0') zero++;
    if (bit == '1') one++;
  }, data);

  gammaRate += one < zero ? '1' : '0';
  epsilonRate += one > zero ? '1' : '0';
}, R.length(R.head(data)));

console.log('1: Result is', parseInt(gammaRate, 2) * parseInt(epsilonRate, 2));

// Part 2

const mapIndexed = R.addIndex(R.map);

const takeIndexes = (indexes, array) =>
  R.compose(
    R.reject(R.isNil),
    mapIndexed((val, index) => (R.includes(index, indexes) ? val : undefined))
  )(array);

const indexesOfBit = (i, bit, data) =>
  R.compose(
    R.reject(R.isNil),
    mapIndexed((val, index) => (val[i] == bit ? index : undefined))
  )(data);

const findRating = (i, data, type) => {
  const indexesOfOnes = indexesOfBit(i, '1', data);
  const indexesOfZeroes = indexesOfBit(i, '0', data);

  let res;

  if (type == 'generator') {
    res =
      R.length(indexesOfOnes) >= R.length(indexesOfZeroes)
        ? indexesOfOnes
        : indexesOfZeroes;
  }

  if (type == 'scrubber') {
    res =
      R.length(indexesOfZeroes) <= R.length(indexesOfOnes)
        ? indexesOfZeroes
        : indexesOfOnes;
  }

  return takeIndexes(res, data);
};

let oxygenGeneratorRating;
let co2ScrubberRating;

const getOxygenGeneratorRating = (sourceData, index = 0) => {
  const data = findRating(index, sourceData, 'generator');

  if (data.length == 1) {
    oxygenGeneratorRating = data[0];
  } else {
    getOxygenGeneratorRating(data, index + 1);
  }
};

const getCo2ScrubberRating = (sourceData, index = 0) => {
  const data = findRating(index, sourceData, 'scrubber');

  if (data.length == 1) {
    co2ScrubberRating = data[0];
  } else {
    getCo2ScrubberRating(data, index + 1);
  }
};

getOxygenGeneratorRating(data);
getCo2ScrubberRating(data);

console.log(
  '2: Result is',
  parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2)
);
