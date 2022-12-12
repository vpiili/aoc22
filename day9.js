import fs from "fs";
import assert from "assert";
import * as R from "ramda";
import { nextTick } from "process";

const parseInput = (input) =>
  input
    .split("\n")
    .map((line) => ({
      direction: line.split(" ")[0],
      amount: Number(line.split(" ")[1]),
    }))
    .map(({ direction, amount }) => R.times(() => direction, amount))
    .flat();

const initialState = { head: { x: 0, y: 0 }, tail: { x: 0, y: 0 } };

const moveHead = (head, step) =>
  step === "R"
    ? { ...head, x: head.x + 1, step: "R" }
    : step === "D"
    ? { ...head, y: head.y - 1, step: "D" }
    : step === "L"
    ? { ...head, x: head.x - 1, step: "L" }
    : { ...head, y: head.y + 1, step: "U" };

const moveTail = (head, tail) => {
  const state = { head, tail };
  const step = head.step;
  const tailMoves =
    Math.abs(state.head.x - state.tail.x) > 1 ||
    Math.abs(state.head.y - state.tail.y) > 1;

  if (tailMoves) {
    if (state.head.x === state.tail.x || state.head.y === state.tail.y)
      return step === "R"
        ? { ...state.tail, step, x: state.tail.x + 1 }
        : step === "D"
        ? { ...state.tail, step, y: state.tail.y - 1 }
        : step === "L"
        ? { ...state.tail, step, x: state.tail.x - 1 }
        : step === "U"
        ? { ...state.tail, step, y: state.tail.y + 1 }
        : moveTail(
            {
              ...state.head,
              step:
                state.head.x === state.tail.x
                  ? step.replace(/R|L/, "")
                  : step.replace(/U|D/, ""),
            },
            tail
          );
    else
      return step === "R"
        ? {
            step: `R${state.head.y > state.tail.y ? "U" : "D"}`,
            x: state.tail.x + 1,
            y: state.head.y,
          }
        : step === "D"
        ? {
            step: `D${state.head.x > state.tail.x ? "R" : "L"}`,
            x: state.head.x,
            y: state.tail.y - 1,
          }
        : step === "L"
        ? {
            step: `L${state.head.y > state.tail.y ? "U" : "D"}`,
            x: state.tail.x - 1,
            y: state.head.y,
          }
        : step === "U"
        ? {
            step: `U${state.head.x > state.tail.x ? "R" : "L"}`,
            x: state.head.x,
            y: state.tail.y + 1,
          }
        : step === "UL" || step === "LU"
        ? { step: "UL", x: state.tail.x - 1, y: state.tail.y + 1 }
        : step === "RU" || step === "UR"
        ? { step: "RU", x: state.tail.x + 1, y: state.tail.y + 1 }
        : step === "LD" || step === "DL"
        ? { step: "LD", x: state.tail.x - 1, y: state.tail.y - 1 }
        : { step: "RD", x: state.tail.x + 1, y: state.tail.y - 1 };
  } else return { ...state.tail, step: "N" };
};

const part1 = (input) =>
  R.uniqWith((a, b) => a.x === b.x && a.y === b.y)(
    parseInput(input).reduce(
      (acc, step) => {
        const nextHead = moveHead(acc.state.head, step);
        const nextTail = moveTail(nextHead, acc.state.tail);
        return {
          state: { head: nextHead, tail: nextTail },
          tails: acc.tails.concat(nextTail),
        };
      },
      { state: initialState, tails: [] }
    ).tails
  ).length;

const part2 = (input) =>
  R.uniqWith((a, b) => a.x === b.x && a.y === b.y)(
    parseInput(input).reduce(
      (acc, step) => {
        const nextHead = moveHead(acc.knots[0], step);
        const nextTails = acc.knots.slice(1).reduce(
          (acc, tail) => {
            const nextTail = moveTail(acc.head, tail);
            return { head: nextTail, tails: acc.tails.concat(nextTail) };
          },
          {
            head: nextHead,
            tails: [],
          }
        ).tails;
        return {
          knots: [nextHead].concat(nextTails),
          tails: acc.tails.concat(nextTails.slice(-1)[0]),
        };
      },
      {
        knots: [...Array(10).keys()].map((_) => ({ x: 0, y: 0 })),
        tails: [],
      }
    ).tails
  ).length;

const testInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const testInput2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

assert(part1(testInput) === 13);
assert(part2(testInput2) === 36);

const input = fs.readFileSync("inputs/day9.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
