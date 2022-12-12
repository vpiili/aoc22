import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) =>
  input.split("\n\n").map((block) => block.split("\n").map(Number));

const part1 = (input) => Math.max(...parseInput(input).map(R.sum));
const part2 = (input) => R.sum(parseInput(input).map(R.sum).slice(-3));

const testInput = `1000

2000
3000

4000

5000
6000

7000
8000
9000

10000`;

assert(part1(testInput) === 24000);
assert(part2(testInput) === 45000);

const input = fs.readFileSync("inputs/day1.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
