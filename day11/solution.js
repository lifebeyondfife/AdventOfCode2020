const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const space = {
  EMPTY: "empty",
  FLOOR: "floor",
  OCCUPIED: "occupied",
};

const adjacentSpacesRule1 = (spaces, x, y) => {
  let adjacentCount = 0;
  if (x > 0 && y > 0) {
    adjacentCount =
      spaces[y - 1][x - 1] === space.OCCUPIED
        ? adjacentCount + 1
        : adjacentCount;
  }
  if (x > 0) {
    adjacentCount =
      spaces[y][x - 1] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
  }
  if (x > 0 && y < spaces.length - 1) {
    adjacentCount =
      spaces[y + 1][x - 1] === space.OCCUPIED
        ? adjacentCount + 1
        : adjacentCount;
  }
  if (y > 0) {
    adjacentCount =
      spaces[y - 1][x] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
  }
  if (y < spaces.length - 1) {
    adjacentCount =
      spaces[y + 1][x] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
  }
  if (x < spaces[0].length - 1 && y > 0) {
    adjacentCount =
      spaces[y - 1][x + 1] === space.OCCUPIED
        ? adjacentCount + 1
        : adjacentCount;
  }
  if (x < spaces[0].length - 1) {
    adjacentCount =
      spaces[y][x + 1] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
  }
  if (x < spaces[0].length - 1 && y < spaces.length - 1) {
    adjacentCount =
      spaces[y + 1][x + 1] === space.OCCUPIED
        ? adjacentCount + 1
        : adjacentCount;
  }
  return adjacentCount;
};

const adjacentSpacesRule2 = (spaces, x, y) => {
  let adjacentCount = 0;
  let [xo, yo] = [x, y];
  [xo, yo] = [x - 1, y - 1];
  while (xo >= 0 && yo >= 0) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo - 1, yo - 1];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x - 1, y];
  while (xo >= 0) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo - 1, yo];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x - 1, y + 1];
  while (xo >= 0 && yo < spaces.length) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo - 1, yo + 1];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x, y - 1];
  while (yo >= 0) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo, yo - 1];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x, y + 1];
  while (yo < spaces.length) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo, yo + 1];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x + 1, y - 1];
  while (xo < spaces[0].length && yo >= 0) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo + 1, yo - 1];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x + 1, y];
  while (xo < spaces[0].length) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo + 1, yo];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  [xo, yo] = [x + 1, y + 1];
  while (xo < spaces[0].length && yo < spaces.length) {
    if (spaces[yo][xo] === space.FLOOR) {
      [xo, yo] = [xo + 1, yo + 1];
      continue;
    }
    adjacentCount =
      spaces[yo][xo] === space.OCCUPIED ? adjacentCount + 1 : adjacentCount;
    break;
  }
  return adjacentCount;
};

const evolveState = (initialState, tolerance, adjacentSpaces) => {
  const nextState = [];
  let occupied = 0;
  for (let y = 0; y < initialState.length; ++y) {
    nextState.push([]);
    for (let x = 0; x < initialState[0].length; ++x) {
      if (initialState[y][x] === space.FLOOR) {
        nextState[y].push(space.FLOOR);
      } else {
        const adjacentCount = adjacentSpaces(initialState, x, y);
        if (initialState[y][x] === space.EMPTY && adjacentCount === 0) {
          nextState[y].push(space.OCCUPIED);
        } else if (
          initialState[y][x] === space.OCCUPIED &&
          adjacentCount >= tolerance
        ) {
          nextState[y].push(space.EMPTY);
        } else {
          nextState[y].push(initialState[y][x]);
        }
        occupied = nextState[y][x] == space.OCCUPIED ? occupied + 1 : occupied;
      }
    }
  }
  return [occupied, nextState];
};

const findStableState = (initialState, tolerance, adjacentSpaces) => {
  let previousOccupancy = initialState
    .map((y) => y.map((x) => x === space.OCCUPIED))
    .reduce((c, o) => c + o.filter((z) => z).length, 0);
  let [occupancy, nextState] = evolveState(
    initialState,
    tolerance,
    adjacentSpaces
  );
  while (occupancy !== previousOccupancy) {
    previousOccupancy = occupancy;
    [occupancy, nextState] = evolveState(nextState, tolerance, adjacentSpaces);
  }
  return occupancy;
};

fs.readFile("./input.txt", (err, data) => {
  const spaces = decoder
    .write(data)
    .split("\n")
    .filter((l) => l !== "")
    .map((y) => y.split("").map((x) => (x == "L" ? space.EMPTY : space.FLOOR)));

  console.log(`Solution 1: ${findStableState(spaces, 4, adjacentSpacesRule1)}`);
  console.log(`Solution 2: ${findStableState(spaces, 5, adjacentSpacesRule2)}`);
});
