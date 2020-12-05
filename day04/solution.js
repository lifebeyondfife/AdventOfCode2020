const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const isValidPassport = (passport) => {
  const fields = Object.keys(passport).length;
  return fields === 8 || (fields === 7 && passport["cid"] == null);
};

const checkBounds = (property, lowerBound, upperBound) => {
  return property >= lowerBound && property <= upperBound;
};

const validYears = (passport) => {
  return (
    checkBounds(passport.byr, 1920, 2002) &&
    checkBounds(passport.iyr, 2010, 2020) &&
    checkBounds(passport.eyr, 2020, 2030)
  );
};

const validHeight = (height) => {
  if (height == null) {
    return false;
  }

  if (height.endsWith("in")) {
    return checkBounds(parseInt(height), 59, 76);
  } else if (height.endsWith("cm")) {
    return checkBounds(parseInt(height), 150, 193);
  } else {
    return false;
  }
};

const validHairColour = (hairColour) => {
  return hairColour && hairColour.match(/^#[0-9a-f]{6}$/) !== null;
};

const validEyeColour = (eyeColour) => {
  return new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]).has(
    eyeColour
  );
};

const validPid = (pid) => {
  return pid && pid.match(/^[0-9]{9}$/) !== null;
};

const isValidPassportDetailed = (passport) => {
  const fields = Object.keys(passport).length;

  if (
    !validYears(passport) ||
    !validHeight(passport.hgt) ||
    !validHairColour(passport.hcl) ||
    !validEyeColour(passport.ecl) ||
    !validPid(passport.pid)
  ) {
    return false;
  }

  return fields === 8 || (fields === 7 && passport["cid"] == null);
};

fs.readFile("./input.txt", (err, data) => {
  const passports = decoder
    .write(data)
    .split("\n\n")
    .map((x) => {
      const fields = x.split(/[ \n]+/);
      return fields
        .filter((f) => f !== "")
        .map((f) => f.split(":"))
        .reduce((map, obj) => {
          map[obj[0]] = obj[1];
          return map;
        }, {});
    });

  console.log(
    `Solution 1: ${passports.filter((p) => isValidPassport(p)).length}`
  );
  console.log(
    `Solution 2: ${passports.filter((p) => isValidPassportDetailed(p)).length}`
  );
});
