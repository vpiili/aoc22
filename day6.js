import fs from "fs";
import assert from "assert";

const findMarker = (input, markerSize) =>
  input.split("").findIndex((char, index, chars) => {
    const test = chars.slice(index, index + markerSize);
    return new Set(test).size === test.length;
  }) + markerSize;

const part1 = (input) => findMarker(input, 4);
const part2 = (input) => findMarker(input, 14);

assert(part1("bvwbjplbgvbhsrlpgdmjqwftvncz") === 5);
assert(part1("nppdvjthqldpwncqszvftbrmjlhg") === 6);
assert(part1("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg") === 10);
assert(part1("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw") === 11);

assert(part2("mjqjpqmgbljsphdztnvjfqwrcgsmlb") === 19);
assert(part2("bvwbjplbgvbhsrlpgdmjqwftvncz") === 23);
assert(part2("nppdvjthqldpwncqszvftbrmjlhg") === 23);
assert(part2("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg") === 29);
assert(part2("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw") === 26);

const input = fs.readFileSync("inputs/day6.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
