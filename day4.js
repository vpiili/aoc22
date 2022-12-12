import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) =>
  input
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((lines) => lines.split("-"))
        .flat()
        .filter((char) => !isNaN(char))
    )
    .map((chars) => chars.map(Number))
    .map((nums) => [
      R.range(nums[0], nums[1] + 1),
      R.range(nums[2], nums[3] + 1),
    ]);

const part1 = (input) =>
  parseInput(input).filter((ranges) => {
    const intersection = R.intersection(...ranges);
    return (
      intersection.length === ranges[0].length ||
      intersection.length == ranges[1].length
    );
  }).length;

const part2 = (input) =>
  parseInput(input).filter((ranges) => R.intersection(...ranges).length !== 0)
    .length;

const testInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

console.log(part1(testInput));
console.log(part2(testInput));

assert(part1(testInput) === 2);
assert(part2(testInput) === 4);

const input = fs.readFileSync("inputs/day4.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
