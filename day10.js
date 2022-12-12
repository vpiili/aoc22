import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) =>
  input
    .split("\n")
    .map((line) => (line === "noop" ? 0 : [0, Number(line.split(" ")[1])]))
    .flat();

const tick = (value, cycle = 1, X = 0) => {
  return { cycle: cycle + 1, X: X + value };
};

const part1 = (input) =>
  R.sum(
    parseInput(input).reduce(
      (acc, command) => {
        if ((acc.cycle + 20) % 40 === 0)
          acc.memory = acc.memory.concat(acc.cycle * acc.X);

        const { cycle, X } = tick(command, acc.cycle, acc.X);
        return { ...acc, cycle, X };
      },
      { cycle: 1, X: 1, memory: [] }
    ).memory
  );

const getScreen = (litPixels) =>
  [...Array(240)]
    .map((_, index) => ((index * 39 - 1) % 40 === 0 && index > 0 ? ".\n" : "."))
    .map((pixel, index) =>
      litPixels.includes(index) ? pixel.replace(".", "#") : pixel
    )
    .join("");

const part2 = (input) =>
  getScreen(
    parseInput(input).reduce(
      (acc, command) => {
        const index = Math.floor((acc.cycle - 1) / 40) * 40;
        if (Math.abs(acc.cycle - (index + acc.X + 1)) < 2)
          acc.litPixels = acc.litPixels.concat(acc.cycle - 1);
        const { cycle, X } = tick(command, acc.cycle, acc.X);

        return { ...acc, cycle, X };
      },
      {
        cycle: 1,
        X: 1,
        litPixels: [],
      }
    ).litPixels
  );

const testInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const testOutput = `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`;

assert(part1(testInput) === 13140);

assert.equal(part2(testInput), testOutput);

const input = fs.readFileSync("inputs/day10.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: \n${part2(input)}`);
