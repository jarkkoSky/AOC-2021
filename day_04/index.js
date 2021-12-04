const R = require('ramda');
const fs = require('fs');

const removeEmpty = R.reject((val) => val === '');
const mapIndexed = R.addIndex(R.map);
const sortByIndex = (index, arr) =>
  R.sort((a, b) => {
    return a[index] - b[index];
  }, arr);

const groupWithIndex = (index, arr) =>
  R.groupWith((a, b) => a[index] === b[index], sortByIndex(index, arr));

const takeNumberAndAllBefore = (number, arr) =>
  R.compose(
    R.append(number),
    R.takeWhile((x) => x !== number)
  )(arr);

/** Bingohit [boardIndex, rowIndex, positionIndex] */

const data = R.compose(
  R.split('\r\n'),
  R.toString,
  fs.readFileSync
)('./input.txt');

const numbers = R.compose(R.map(parseInt), R.split(','))(data[0]);

const boards = R.compose(
  R.splitEvery(5),
  R.map(R.compose(R.map(parseInt), removeEmpty, R.split(' '))),
  removeEmpty,
  R.remove(0, 1)
)(data);

const playBingoNumber = (number, hits) => {
  mapIndexed((board, boardIndex) => {
    mapIndexed((row, rowIndex) => {
      const positionIndex = R.findIndex(R.equals(number), row);

      if (positionIndex !== -1) {
        hits.push([boardIndex, rowIndex, positionIndex]);
      }
    }, board);
  }, boards);
};

const checkForWinner = (hits) => {
  const groupedByBoard = R.groupWith(
    (a, b) => a[0] === b[0],
    sortByIndex(0, hits)
  );

  const winningIndexes = [];

  R.map((board) => {
    const rows = groupWithIndex(1, board);
    const columns = groupWithIndex(2, board);

    for (let row of rows) {
      if (R.length(row) === 5) {
        winningIndexes.push(board[0][0]);
      }
    }

    for (let column of columns) {
      if (R.length(column) === 5) {
        winningIndexes.push(board[0][0]);
      }
    }
  })(groupedByBoard);

  return winningIndexes;
};

const playBingo = (boardFn) => {
  const winningBoards = [];
  const hits = [];

  for (let number of numbers) {
    playBingoNumber(number, hits);

    R.map((boardIndex) => {
      if (R.findIndex((val) => val[0] == boardIndex, winningBoards) == -1) {
        winningBoards.push([boardIndex, number]);
      }
    })(checkForWinner(hits));
  }

  const resultBoard = boardFn(winningBoards);
  const numbersCalledBeforeLast = takeNumberAndAllBefore(
    resultBoard[1],
    numbers
  );

  R.compose(
    (x) => console.log('Result is', x),
    R.multiply(resultBoard[1]),
    R.sum,
    R.without(numbersCalledBeforeLast),
    R.flatten
  )(boards[resultBoard[0]]);
};

/* Part 1: 2745 */
playBingo(R.head);
/** Part 2: 6594 */
playBingo(R.last);
