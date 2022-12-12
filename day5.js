import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) => {
  const lines = input.split("\n");
  const start = R.transpose(
    lines
      .slice(0, lines.findIndex((line) => line.indexOf("move") !== -1) - 1)
      .map((line) => line.match(/.{1,4}/g))
      .map((line) => line.map((col) => col.match(/\w|\d/g) ?? null).flat())
  );
  const instructions = lines.slice(
    lines.findIndex((line) => line.indexOf("move") !== -1)
  );

  const stacks = Object.fromEntries(
    start.map((entry) => [
      entry.slice(-1),
      entry
        .filter((elem) => elem)
        .slice(0, -1)
        .reverse(),
    ])
  );

  return { stacks, instructions };
};

const part1 = (input) => {
  const { stacks, instructions } = parseInput(input);

  instructions.forEach((instruction) => {
    const [amount, from, to] = instruction
      .split(" ")
      .filter((elem) => !isNaN(elem));
    for (let i = 0; i < Number(amount); i++) {
      stacks[to].push(stacks[from].pop());
    }
  });

  return Object.values(stacks)
    .map((stack) => stack.pop())
    .join("");
};

const part2 = (input) => {
  const { stacks, instructions } = parseInput(input);

  instructions.forEach((instruction) => {
    const [amount, from, to] = instruction
      .split(" ")
      .filter((elem) => !isNaN(elem));

    stacks[to] = stacks[to].concat(
      stacks[from].splice(-Number(amount), Number(amount))
    );
  });

  return Object.values(stacks)
    .map((stack) => stack.pop())
    .join("");
};

const testInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

assert(part1(testInput) === "CMZ");
assert(part2(testInput) === "MCD");

const input = fs.readFileSync("inputs/day5.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
