function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  if (x === j && y === k) {
    return true;
  } else {
    return false;
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for (let i = 0; i < this.length; i++) {
    if (same(cell, this[i])) {
      return true;
    }
  }
  return false;
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return '\u25A3';
  } else {
    return '\u25A2';
  }
};

const corners = (state = []) => {
  let top = 0; // max Y
  let right = 0; // max X
  let bottom = 0; // min Y
  let left = 0; // min X

  if (state.length > 0) {
    left = state[0][0];
    right = state[0][0];
    bottom = state[0][1];
    top = state[0][1];
  }

  for (let i = 1; i < state.length; i++) {
    if (state[i][0] < left) {
      left = state[i][0];
    }
    if (state[i][0] > right) {
      right = state[i][0];
    }
    if (state[i][1] < bottom) {
      bottom = state[i][1];
    }
    if (state[i][1] > top) {
      top = state[i][1];
    }
  }

  return {
    topRight: [right, top],
    bottomLeft: [left, bottom]
  };
};

const printCells = (state) => {
  let result = '';
  const { topRight, bottomLeft } = corners(state);
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      result += printCell([x, y], state);
    }
    result += '\n';
  }
  return result;
};

const getNeighborsOf = ([x, y]) => {
  return [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]];
};

const getLivingNeighbors = (cell, state) => {
  let result = [];
  const neighbors = getNeighborsOf(cell);
  const checkLive = contains.bind(state);
  for (let i = 0; i < neighbors.length; i++) {
    if (checkLive(neighbors[i])) {
      result.push(neighbors[i]);
    }
  }
  return result;
};

const willBeAlive = (cell, state) => {
  // the cell has 3 living neighbors, or.
  // the cell is currently alive and has 2 living neighbors
  if (getLivingNeighbors(cell, state).length === 3 ||
    (contains.call(state, cell) && getLivingNeighbors(cell, state).length === 2)) {
    return true;
  }

  return false;
};

const calculateNext = (state) => {
  const { topRight, bottomLeft } = corners(state);
  const fromX = bottomLeft[0] - 1;
  const fromY = bottomLeft[1] - 1;
  const toX = topRight[0] + 1;
  const toY = topRight[0] + 1;
  let netxState = [];
  for (let x = fromX; x <= toX; x++) {
    for (let y = fromY; y <= toY; y++) {
      if (willBeAlive([x, y], state)) {
        netxState.push([x, y]);
      }
    }
  }
  return netxState;
};

const iterate = (state, iterations) => {
  let gameStates = [];
  gameStates.push(state);
  for (let i = 0; i < iterations; i++) {
    gameStates.push(calculateNext(gameStates[i]));
  }
  return gameStates;
};

const main = (pattern, iterations) => {
  let startState;

  switch (pattern) {
    case 'rpentomino':
      startState = startPatterns.rpentomino;
      break;
    case 'glider':
      startState = startPatterns.glider;
      break;
    case 'square':
      startState = startPatterns.square;
      break;
    default:
      break;
  }

  const gameStates = iterate(startState, iterations);
  for (let i = 0; i < gameStates.length; i++) {
    console.log(printCells(gameStates[i]));
    console.log('\n');
  }
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;