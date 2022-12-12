import fs from "fs";
import assert from "assert";

const parseInput = (input) => input.split("\n");

const testInput = `A Y
B X
C Z`;

const getLineValue = (line) => {
  switch (line) {
    case "A X":
      return 4;

    case "B X":
      return 1;

    case "C X":
      return 7;

    case "A Y":
      return 8;

    case "B Y":
      return 5;

    case "C Y":
      return 2;

    case "A Z":
      return 3;

    case "B Z":
      return 9;

    case "C Z":
      return 6;
  }
};

const getLineValue2 = (line) => {
  switch (line) {
    case "A X":
      return 3;

    case "B X":
      return 1;

    case "C X":
      return 2;

    case "A Y":
      return 4;

    case "B Y":
      return 5;

    case "C Y":
      return 6;

    case "A Z":
      return 8;

    case "B Z":
      return 9;

    case "C Z":
      return 7;
  }
};

const part1 = (input) =>
  parseInput(input).reduce((acc, line) => acc + getLineValue(line), 0);

const part2 = (input) =>
  parseInput(input).reduce((acc, line) => acc + getLineValue2(line), 0);

assert(part1(testInput) === 15);
assert(part2(testInput) === 12);

const input = fs.readFileSync("inputs/day2.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
