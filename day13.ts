import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) =>
  input.split("\n\n").map((block) => block.split("\n").map(JSON.parse));

function smaller(left: number, right: number): number;
function smaller(left: number, right: (number | number[])[]): number;
function smaller(left: (number | number[])[], right: number): number;
function smaller(
  left: (number | number[])[],
  right: (number | number[])[]
): number;

function smaller(left, right): number {
  if (typeof left === "number" && typeof right === "number")
    return left === right ? 0 : left < right ? 1 : -1;
  else if (left instanceof Array && right instanceof Array) {
    const shorter = left.length < right.length ? left : right;

    const foo = shorter.map((_, index) => smaller(left[index], right[index]));
    if (foo.every((num) => num === 0)) {
      return left.length === right.length
        ? 0
        : left.length === shorter.length
        ? 1
        : -1;
    } else {
      return foo.find((num) => num === 1 || num === -1);
    }
  } else if (left instanceof Array) {
    return smaller(left, [right]);
  } else {
    return smaller([left], right);
  }
}

const arrange = (packets) => {
  return packets.sort(smaller).reverse();
};

const part1 = (input) =>
  R.sum(
    parseInput(input).map(([left, right], index) => {
      return smaller(left, right) === 1 ? index + 1 : 0;
    })
  );

const part2 = (input) => {
  const arranged = arrange(
    parseInput(input)
      .flat()
      .concat([[2]])
      .concat([[6]])
  );
  return (
    (arranged.findIndex((elem) => elem.length === 1 && elem[0] === 2) + 1) *
    (arranged.findIndex((elem) => elem.length === 1 && elem[0] === 6) + 1)
  );
};

const testInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const testOutput = `[]
[[]]
[[[]]]
[1,1,3,1,1]
[1,1,5,1,1]
[[1],[2,3,4]]
[1,[2,[3,[4,[5,6,0]]]],8,9]
[1,[2,[3,[4,[5,6,7]]]],8,9]
[[1],4]
[[2]]
[3]
[[4,4],4,4]
[[4,4],4,4,4]
[[6]]
[7,7,7]
[7,7,7,7]
[[8,7,6]]
[9]`;

assert(smaller([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]) === 1);
assert(smaller([[1], [2, 3, 4]], [[1], 4]) === 1);
assert(smaller([9], [[8, 7, 6]]) === -1);
assert(smaller([[4, 4], 4, 4], [[4, 4], 4, 4, 4]) === 1);
assert(smaller([7, 7, 7, 7], [7, 7, 7]) === -1);
assert(smaller([], [3]) === 1);
assert(smaller([[[]]], [[]]) === -1);
assert(
  smaller(
    [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
    [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
  ) === -1
);

assert(part1(testInput) === 13);
assert(part2(testInput) === 140);

const input = fs.readFileSync("inputs/day13.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
