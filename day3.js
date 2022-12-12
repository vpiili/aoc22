import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) => input.split("\n").map((line) => line.split(""));

const testInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const charValue = (character) => {
  return character.charCodeAt(0) - (character.match(/[A-Z]/) ? 38 : 96);
};

const part1 = (input) => {
  const lines = parseInput(input);

  return lines.reduce(
    (acc, chars) =>
      acc +
      charValue(
        R.intersection(
          chars.slice(0, Math.ceil(chars.length / 2)),
          chars.slice(Math.ceil(chars.length / 2))
        )[0]
      ),
    0
  );
};

const part2 = (input) => {
  const lines = parseInput(input);
  return lines.reduce(
    (acc, line, index) =>
      acc +
      (index % 3 === 0
        ? charValue(
            R.intersection(
              R.intersection(line, lines[index + 1]),
              lines[index + 2]
            )[0]
          )
        : 0),
    0
  );
};

assert(part1(testInput) === 157);
assert(part2(testInput) === 70);

const input = fs.readFileSync("inputs/day3.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
