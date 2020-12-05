const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const generateSeat = (row, column) => {
  return { row: row, column: column, seatID: row * 8 + column };
};

const getLargestSeat = (seats) => {
  return seats.sort((a, b) => (a.seatID < b.seatID ? 1 : -1))[0].seatID;
};

const findEmptySeat = (seats) => {
  const seatIDs = seats.map(x => x.seatID).reverse();
  let seatIndex = 0;
  let seatID = seatIDs[seatIndex];
  while (seatIDs[++seatIndex] == seatID + 1) {
    seatID = seatIDs[seatIndex];
  }

  return seatID + 1;
};

fs.readFile("./input.txt", (err, data) => {
  const seats = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => {
      const binaryString = [...x]
        .map((b) => (b === "B" || b === "R" ? "1" : "0"))
        .join("");
      return generateSeat(
        parseInt(binaryString.slice(0, 7), 2),
        parseInt(binaryString.slice(7, 10), 2)
      );
    });

  console.log(`Solution 1: ${getLargestSeat(seats)}`);
  console.log(`Solution 2: ${findEmptySeat(seats)}`);
});
