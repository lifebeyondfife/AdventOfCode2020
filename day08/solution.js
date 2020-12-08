const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const opCodes = {
  nop: (jump) => (idx, state, inverse) => (inverse ? idx + jump : idx + 1),
  jmp: (jump) => (idx, state, inverse) => (inverse ? idx + 1 : idx + jump),
  acc: (add) => (idx, state, inverse) => {
    state.accumulator += add;
    return idx + 1;
  },
};

const runProgram = (assembler, state, invertLine) => {
  const visited = new Set();
  let lineNumber = 0;
  while (!visited.has(lineNumber) && lineNumber < assembler.length) {
    visited.add(lineNumber);
    lineNumber = assembler[lineNumber](
      lineNumber,
      state,
      lineNumber == invertLine
    );
  }
  return lineNumber == assembler.length;
};

const findAccumulatorAtLoop = (assembler) => {
  const state = { accumulator: 0 };
  runProgram(assembler, state, -1);
  return state.accumulator;
};

const invertOpCodes = (assembler) => {
  for (let i = 0; i < assembler.length; ++i) {
    const state = { accumulator: 0 };
    if (runProgram(assembler, state, i)) {
      return state.accumulator;
    }
  }
};

fs.readFile("./input.txt", (err, data) => {
  const assembler = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => x.split(" "))
    .map((x) => opCodes[x[0]](parseInt(x[1])));

  console.log(`Solution 1: ${findAccumulatorAtLoop(assembler)}`);
  console.log(`Solution 2: ${invertOpCodes(assembler)}`);
});
