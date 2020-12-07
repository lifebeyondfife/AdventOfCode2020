const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const parentRegex = /^([a-z]* [a-z]*) bags contain ([a-z0-9 ,]*).$/;
const childRegex = /^([0-9]{1}) ([a-z]* [a-z]*) bags?$/;

const generateOuterBags = (bagMap) => {
  for (const [key, value] of Object.entries(bagMap)) {
    value.children.forEach((c) => {
      if (bagMap[c.name].parents) {
        bagMap[c.name].parents.push(key);
      } else {
        bagMap[c.name].parents = [key];
      }
    });
  }
};

const findParents = (bagMap, bagName, parentSet) => {
  if (bagMap[bagName].parents == null) {
    return new Set();
  }
  bagMap[bagName].parents.forEach((bn) => {
    parentSet = new Set([
      ...parentSet,
      bn,
      ...findParents(bagMap, bn, parentSet),
    ]);
  });
  return parentSet;
};

const findChildrenBagCount = (bagMap, bagName) => {
  if (bagMap[bagName].children.length == 0) {
    return 0;
  }
  return bagMap[bagName].children
    .map((c) => c.count * (findChildrenBagCount(bagMap, c.name) + 1))
    .reduce((a, b) => a + b, 0);
};

fs.readFile("./input.txt", (err, data) => {
  const bagMap = decoder
    .write(data)
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => {
      const matchParent = x.match(parentRegex);
      return {
        parent: matchParent[1],
        children: matchParent[2]
          .split(", ")
          .filter((y) => y != "no other bags")
          .map((y) => {
            const matchChild = y.match(childRegex);
            return { count: parseInt(matchChild[1]), name: matchChild[2] };
          }),
      };
    })
    .reduce((map, obj) => {
      map[obj.parent] = { children: obj.children };
      return map;
    }, {});

  generateOuterBags(bagMap);

  console.log(
    `Solution 1: ${findParents(bagMap, "shiny gold", new Set()).size}`
  );
  console.log(`Solution 2: ${findChildrenBagCount(bagMap, "shiny gold")}`);
});
