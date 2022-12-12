import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const parseInput = (input) => {
  const matrix = input.split("\n").map((line) => line.split(""));

  const startY = matrix.findIndex((row) => row.includes("S"));
  const startX = matrix[startY].findIndex((elem) => elem === "S");
  const goalY = matrix.findIndex((row) => row.includes("E"));
  const goalX = matrix[goalY].findIndex((elem) => elem === "E");

  const heightMap = matrix.map((row) =>
    row.map((text) =>
      text === "S" ? -1 : text === "E" ? 26 : text.charCodeAt(0) - 97
    )
  );

  return {
    start: { x: startX, y: startY },
    goal: { x: goalX, y: goalY },
    heightMap,
  };
};

const getNeighbours = ({ x, y }, matrix) =>
  [
    { x: x, y: y + 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x, y: y - 1 },
  ].filter(
    ({ x, y }) => x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length
  );

const reconstructPath = (cameFrom, current) => {
  let totalPath = [current];
  const keys = Object.keys(cameFrom);

  while (keys.includes(key(current))) {
    current = cameFrom[key(current)];
    totalPath.push(current);
  }
  return totalPath;
};

const key = ({ x, y }) => `${x}.${y}`;

const A_Star = (
  start,
  goal,
  graph,
  h = (n, goal) => Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y)
) => {
  let openSet = [start];
  let cameFrom = {};

  const gScore = {};
  gScore[key(start)] = 0;

  const fScore = {};
  fScore[key(start)] = !isNaN(goal) ? h(0) : h(start, goal);

  while (openSet.length) {
    const current = openSet.reduce((min, curr) => {
      const { [key(curr)]: fCurr = Infinity } = fScore;
      const { [key(min)]: fMin = Infinity } = fScore;
      return fCurr < fMin ? curr : min;
    }, openSet[0]);

    if (
      !isNaN(goal)
        ? graph[current.y][current.x] === goal
        : current.x === goal.x && current.y === goal.y
    ) {
      return reconstructPath(cameFrom, current);
    }

    openSet = openSet.filter(({ x, y }) => current.x !== x || current.y !== y);
    const neighbours = getNeighbours(current, graph).filter(
      ({ x, y }) => graph[y][x] - graph[current.y][current.x] <= 1
    );
    neighbours.forEach((neighbour) => {
      const { [key(current)]: tentative_gScore = Infinity } = gScore;
      const { [key(neighbour)]: neihgbourG = Infinity } = gScore;
      if (tentative_gScore + 1 < neihgbourG) {
        cameFrom[key(neighbour)] = current;
        gScore[key(neighbour)] = tentative_gScore + 1;
        fScore[key(neighbour)] =
          tentative_gScore +
          1 +
          (!isNaN(goal) ? h(neihgbourG) : h(neighbour, goal));
        if (!openSet.find(({ x, y }) => neighbour.x === x && neighbour.y === y))
          openSet = openSet.concat(neighbour);
      }
    });
  }

  return false;
};

const part1 = (input) => {
  const { start, goal, heightMap } = parseInput(input);
  return A_Star(start, goal, heightMap).length - 1;
};
const part2 = (input, a1) => {
  const { start, goal, heightMap } = parseInput(input);
  const newStart = goal;
  const newHeightMap = heightMap.map((row) => row.map((value) => -value + 26));
  newHeightMap[start.y][start.x] = 26;

  return A_Star(newStart, 26, newHeightMap, (g) => a1 - g).length - 1;
};

const testInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const t1 = part1(testInput);
assert(t1 === 31);
assert(part2(testInput, t1) === 29);

const input = fs.readFileSync("inputs/day12.txt", "utf-8");

const a1 = part1(input);
console.log(`Part 1: ${a1}`);
console.log(`Part 2: ${part2(input, a1)}`);
