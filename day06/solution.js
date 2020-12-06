const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const getGroupSizeSumAnyone = (customForms) => {
  return customForms
    .map((g) => g.reduce((a, b) => new Set([...a, ...b]), new Set()))
    .map((s) => s.size)
    .reduce((x, y) => x + y, 0);
};

const getGroupSizeSumEveryone = (customForms) => {
  return customForms
    .map((g) =>
      g.reduce(
        (a, b) => new Set([...a].filter((x) => b.has(x))),
        new Set([..."abcdefghijklmnopqrstuvwxyz"])
      )
    )
    .map((s) => s.size)
    .reduce((x, y) => x + y, 0);
};

fs.readFile("./input.txt", (err, data) => {
  const customForms = decoder
    .write(data)
    .split("\n\n")
    .map((x) =>
      x
        .split("\n")
        .filter((y) => y !== "")
        .map((y) => new Set([...y]))
    );

  console.log(`Solution 1: ${getGroupSizeSumAnyone(customForms)}`);
  console.log(`Solution 2: ${getGroupSizeSumEveryone(customForms)}`);
});
