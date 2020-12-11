const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const solution1 = (voltages) => {
  let voltage = 0;
  const diffs = voltages
    .sort((a, b) => a - b)
    .map((v) => {
      const diff = v - voltage;
      voltage = v;
      return diff;
    })
    .reduce(
      (map, obj) => {
        map[1] = obj == 1 ? map[1] + 1 : map[1];
        map[3] = obj == 3 ? map[3] + 1 : map[3];
        return map;
      },
      { 1: 0, 3: 1 }
    );
  return diffs[1] * diffs[3];
};

const scores = {
  0: 1,
  1: 1,
  2: 2,
  3: 4,
  4: 7,
};

const solution2 = (voltages) => {
  let voltage = 0;
  return voltages
    .sort((a, b) => a - b)
    .map((v) => {
      const diff = v - voltage;
      voltage = v;
      return diff;
    })
    .join("")
    .split("3")
    .map((x) => x.length)
    .reduce((a, b) => a * scores[b], 1);
};

fs.readFile("./input.txt", (err, data) => {
  const voltages = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => parseInt(x));

  console.log(`Solution 1: ${solution1(voltages)}`);
  console.log(`Solution 2: ${solution2(voltages)}`);
});
