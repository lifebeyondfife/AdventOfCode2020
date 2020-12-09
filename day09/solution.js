const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const findPair = (code, previousCodes) => {
  return [...previousCodes].some(
    (x) => previousCodes.has(code - x) && code - x !== x
  );
};

const findVulnerability = (codes, previousCodeCount = 25) => {
  const previousCodes = new Set(codes.slice(0, previousCodeCount));
  let [remove, add] = [0, previousCodeCount];
  while (findPair(codes[add], previousCodes)) {
    previousCodes.delete(codes[remove++]);
    previousCodes.add(codes[add++]);
  }
  return codes[add];
};

const findWeakness = (codes, vuln) => {
  let [lower, upper, total] = [0, 0, 0];
  while (
    (total = codes.slice(lower, upper).reduce((a, b) => a + b, 0)) != vuln
  ) {
    upper = total < vuln ? upper + 1 : upper;
    lower = total > vuln ? lower + 1 : lower;
  }
  const contiguous = codes.slice(lower, upper).sort();
  return contiguous[0] + contiguous[contiguous.length - 1];
};

fs.readFile("./input.txt", (err, data) => {
  const codes = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => parseInt(x));

  console.log(`Solution 1: ${findVulnerability(codes)}`);
  console.log(`Solution 2: ${findWeakness(codes, findVulnerability(codes))}`);
});
