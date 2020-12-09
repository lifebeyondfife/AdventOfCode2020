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
  let remove = 0;
  let add = previousCodeCount;
  while (findPair(codes[add], previousCodes)) {
    previousCodes.delete(codes[remove++]);
    previousCodes.add(codes[add++]);
  }
  return codes[add];
};

const contiguousSum = (slice, vuln) => {
  let sum = 0;
  let idx = 0;
  let smallest = Number.MAX_SAFE_INTEGER;
  let largest = 0;
  while (idx < slice.length && sum < vuln) {
    smallest = slice[idx] < smallest ? slice[idx] : smallest;
    largest = slice[idx] > largest ? slice[idx] : largest;
    sum += slice[idx++];
  }
  return sum == vuln ? smallest + largest : false;
};

const findWeakness = (codes, vuln) => {
  let weakness = 0;
  for (let i = 0; i < codes.length; ++i) {
    if ((weakness = contiguousSum(codes.slice(i, codes.length), vuln))) {
      return weakness;
    }
  }
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
