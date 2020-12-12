const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const bearing = { x: 0, y: 0, direction: "E" };
const waypoint = { x: 10, y: -1 };
const left = { N: "W", W: "S", S: "E", E: "N" };
const right = { N: "E", E: "S", S: "W", W: "N" };

const commands = {
  N: (forward) => {
    return {
      simple: () => {
        bearing.y -= forward;
      },
      complex: () => {
        waypoint.y -= forward;
      },
    };
  },
  E: (forward) => {
    return {
      simple: () => {
        bearing.x += forward;
      },
      complex: () => {
        waypoint.x += forward;
      },
    };
  },
  S: (forward) => {
    return {
      simple: () => {
        bearing.y += forward;
      },
      complex: () => {
        waypoint.y += forward;
      },
    };
  },
  W: (forward) => {
    return {
      simple: () => {
        bearing.x -= forward;
      },
      complex: () => {
        waypoint.x -= forward;
      },
    };
  },
  L: (degrees) => {
    return {
      simple: () => {
        let degreesBound = degrees;
        while (degreesBound > 0) {
          bearing.direction = left[bearing.direction];
          degreesBound -= 90;
        }
      },
      complex: () => {
        let degreesBound = degrees;
        while (degreesBound > 0) {
          const temp = waypoint.x;
          waypoint.x = waypoint.y;
          waypoint.y = -temp;
          degreesBound -= 90;
        }
      },
    };
  },
  R: (degrees) => {
    return {
      simple: () => {
        let degreesBound = degrees;
        while (degreesBound > 0) {
          bearing.direction = right[bearing.direction];
          degreesBound -= 90;
        }
      },
      complex: () => {
        let degreesBound = degrees;
        while (degreesBound > 0) {
          const temp = waypoint.x;
          waypoint.x = -waypoint.y;
          waypoint.y = temp;
          degreesBound -= 90;
        }
      },
    };
  },
  F: (forward) => {
    return {
      simple: () => {
        commands[bearing.direction](forward).simple();
      },
      complex: () => {
        bearing.x += forward * waypoint.x;
        bearing.y += forward * waypoint.y;
      },
    };
  },
};

const manhattanDistance = (directions, method) => {
  bearing.x = bearing.y = 0;
  const [xo, yo] = [bearing.x, bearing.y];
  directions.forEach((dir) => {
    dir[method]();
  });
  return Math.abs(bearing.x - xo) + Math.abs(bearing.y - yo);
};

fs.readFile("./input.txt", (err, data) => {
  const directions = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => commands[x[0]](parseInt(x.slice(1))));

  console.log(`Solution 1: ${manhattanDistance(directions, "simple")}`);
  console.log(`Solution 2: ${manhattanDistance(directions, "complex")}`);
});
