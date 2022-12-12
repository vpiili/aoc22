import fs from "fs";
import assert from "assert";
import * as R from "ramda";
import { parse } from "path";

const parseInput = (input) => ({
  instructions: input.split("\n\n").map((monkey) => {
    const lines = monkey.split("\n");
    const index = Number(lines[0].split(" ")[1].slice(0, -1));
    const operation = lines[2].split(" ").slice(6);
    const test = Number(lines[3].split(" ")[5]);
    const action = {
      yes: Number(lines[4].split(" ")[9]),
      no: Number(lines[5].split(" ")[9]),
    };
    return { index, operation, test, action };
  }),
  values: Object.fromEntries(
    input.split("\n\n").map((monkey) => {
      const lines = monkey.split("\n");
      const index = Number(lines[0].split(" ")[1].slice(0, -1));
      const items = lines[1].slice(18).split(", ").map(Number);
      return [index, { items, inspections: 0 }];
    })
  ),
});

const round = (instructions, values, stressReducer) => {
  return instructions.reduce((acc, instruction) => {
    const items = R.clone(acc[instruction.index]).items;
    items.forEach((item) => {
      const newWorry = stressReducer(
        eval(`${item} ${instruction.operation.join(" ").replace("old", item)}`)
      );

      acc[instruction.index].items = acc[instruction.index].items.filter(
        (i) => i !== item
      );
      const dest =
        instruction.action[newWorry % instruction.test === 0 ? "yes" : "no"];
      acc[dest].items = acc[dest].items.concat(newWorry);

      acc[instruction.index].inspections += 1;
    });
    return acc;
  }, values);
};

const afterX = (instructions, values, X, manage) => {
  return [...Array(X)].reduce((acc, _) => {
    return round(instructions, acc, manage);
  }, values);
};
const part1 = (input) => {
  const { instructions, values } = parseInput(input);
  const stressReducer = (worry) => Math.floor(worry / 3);
  const after20 = afterX(instructions, values, 20, stressReducer);
  return R.product(
    Object.values(after20)
      .map((v) => v.inspections)
      .sort((a, b) => b - a)
      .slice(0, 2)
  );
};
const part2 = (input) => {
  const { instructions, values } = parseInput(input);

  const modulo = R.product(Object.values(instructions).map(({ test }) => test));
  const stressReducer = (worry) => (worry > modulo ? worry % modulo : worry);
  const after10k = afterX(instructions, values, 10000, stressReducer);
  return R.product(
    Object.values(after10k)
      .map((v) => v.inspections)
      .sort((a, b) => b - a)
      .slice(0, 2)
  );
};

const testInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const testOutput = `Monkey 0: 20, 23, 27, 26
Monkey 1: 2080, 25, 167, 207, 401, 1046
Monkey 2: 
Monkey 3: `;

assert(
  Object.entries(
    round(
      parseInput(testInput).instructions,
      parseInput(testInput).values,
      (w) => Math.floor(w / 3)
    )
  )
    .map(([key, value]) => `Monkey ${key}: ${value.items.join(", ")}`)
    .join("\n") === testOutput
);
assert(part1(testInput) === 10605);
assert(part2(testInput) === 2713310158);

const input = fs.readFileSync("inputs/day11.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
