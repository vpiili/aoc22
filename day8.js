import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) =>
  input.split("\n").map((block) => block.split("").map(Number));

const isVisible = (x, y, trees, transposed) => {
  const size = trees.length;
  if (x === 0 || y === 0 || x === size - 1 || y === size - 1) return true;

  return (
    R.apply(Math.max, trees[y].slice(0, x)) < trees[y][x] ||
    R.apply(Math.max, trees[y].slice(x + 1)) < trees[y][x] ||
    R.apply(Math.max, transposed[x].slice(0, y)) < transposed[x][y] ||
    R.apply(Math.max, transposed[x].slice(y + 1)) < transposed[x][y]
  );
};

const indexOrLength = ([arr, fn]) => {
  const index = arr.findIndex(fn);
  return index === -1 ? arr.length : index + 1;
};

const viewScore = (x, y, trees, transposed) => {
  return R.product(
    [
      [R.reverse(trees[y].slice(0, x)), (height) => height >= trees[y][x]],
      [trees[y].slice(x + 1), (height) => height >= trees[y][x]],
      [
        R.reverse(transposed[x].slice(0, y)),
        (height) => height >= transposed[x][y],
      ],
      [transposed[x].slice(y + 1), (height) => height >= transposed[x][y]],
    ].map(indexOrLength)
  );
};

const part1 = (input) => {
  const trees = parseInput(input);
  const transposed = R.transpose(trees);
  const visible = trees.map((col, y) =>
    col.map((row, x) => isVisible(x, y, trees, transposed))
  );
  return visible.flat().filter((tree) => tree).length;
};
const part2 = (input) => {
  const trees = parseInput(input);
  const transposed = R.transpose(trees);
  const scores = trees.map((col, y) =>
    col.map((row, x) => viewScore(x, y, trees, transposed))
  );
  return R.apply(Math.max, scores.flat());
};

const testInput = `30373
25512
65332
33549
35390`;

assert(part1(testInput) === 21);

assert(
  viewScore(2, 1, parseInput(testInput), R.transpose(parseInput(testInput))) ===
    4
);
assert(
  viewScore(2, 3, parseInput(testInput), R.transpose(parseInput(testInput))) ===
    8
);
assert(part2(testInput) === 8);

const input = fs.readFileSync("inputs/day8.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
