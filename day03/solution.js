const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const getCollisionCount = (trees, x, y) => {
  const position = { x: 0, y: 0 };
  let collisions = 0;

  while (position.y < trees.length) {
    if (trees[position.y][position.x % trees[0].length]) {
      collisions++;
    }
    position.x += x;
    position.y += y;
  }

  return collisions;
};

const getMultipleSlopesProduct = (trees) => {
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  return slopes
    .map((s) => getCollisionCount(trees, s[0], s[1]))
    .reduce((x, y) => x * y, 1);
};

fs.readFile("./input.txt", (err, data) => {
  const trees = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => [...x].map((t) => t === "#"));

  console.log(`Solution 1: ${getCollisionCount(trees, 3, 1)}`);
  console.log(`Solution 2: ${getMultipleSlopesProduct(trees)}`);
});
