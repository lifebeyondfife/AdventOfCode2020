const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const solution1 = (inputMap) => {
  for (const key of Object.keys(inputMap)) {
    if (inputMap[2020 - key]) {
      return (2020 - key) * key;
    }
  }
};

const solution2 = (inputMap) => {
  for (const key of Object.keys(inputMap)) {
    for (const key2 of Object.keys(inputMap)) {
      if (key2 == key) {
        continue;
      }
      if (inputMap[2020 - key - key2]) {
        return (2020 - key - key2) * key * key2;
      }
    }
  }
};

fs.readFile("./input.txt", (err, data) => {
  const inputMap = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => parseInt(x))
    .reduce((map, obj) => {
      map[obj] = true;
      return map;
    }, {});

  console.log(`Solution 1: ${solution1(inputMap)}`);
  console.log(`Solution 2: ${solution2(inputMap)}`);
});
