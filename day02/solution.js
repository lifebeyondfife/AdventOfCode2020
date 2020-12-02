const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const passwordRegex = /^([0-9]*)-([0-9]*) ([a-z]{1}): ([a-z]*)$/;

const isValidPassword = (password) => {
  const occurrences =
    password.password.length -
    password.password.replace(password.letterRegExp, "").length;
  return occurrences >= password.from && occurrences <= password.to;
};

const isValidPasswordOfficial = (password) => {
  const first = password.password[password.from - 1] == password.letter;
  const second = password.password[password.to - 1] == password.letter;

  return (first || second) && !(first && second);
};

const solution = (passwords, passwordValidator) => {
  return passwords.filter((x) => passwordValidator(x)).length;
};

fs.readFile("./input.txt", (err, data) => {
  const passwords = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => {
      const matches = x.match(passwordRegex);
      return {
        from: parseInt(matches[1]),
        to: parseInt(matches[2]),
        letter: matches[3],
        letterRegExp: new RegExp(matches[3], "g"),
        password: matches[4],
      };
    });

    console.log(`Solution 1: ${solution(passwords, isValidPassword)}`);
    console.log(`Solution 2: ${solution(passwords, isValidPasswordOfficial)}`);
});
