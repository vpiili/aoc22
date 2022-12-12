import fs from "fs";
import assert from "assert";
import * as R from "ramda";

const addDirectory = (tree, path) => {
  const foo = R.hasPath(path, tree) ? tree : R.assocPath(path, {}, tree);
  return foo;
};

const addFile = (tree, path, file) => {
  return R.assocPath(
    path,
    { ...R.path(path, tree), [file.split(" ")[1]]: Number(file.split(" ")[0]) },
    tree
  );
};

const parseInput = (input) => input.split("\n");

const createTree = (prompt, currentPath = [], tree = {}) => {
  const [head, ...tail] = prompt;

  if (head === undefined) {
    return tree;
  } else if (head.match(/cd \.\./)) {
    return createTree(tail, currentPath.slice(0, -1), tree);
  } else if (head.match(/cd .+/)) {
    const path = currentPath.concat(head.split(" ")[2]);
    return createTree(tail, path, addDirectory(tree, path));
  } else if (head.match(/\d+/)) {
    return createTree(tail, currentPath, addFile(tree, currentPath, head));
  } else {
    return createTree(tail, currentPath, tree);
  }
};

const getContents = (contents) =>
  Object.entries(contents).reduce(
    (acc, [key, value]) =>
      isDirectory(value)
        ? { ...acc, dirs: acc.dirs.concat(key) }
        : { ...acc, files: acc.files.concat(value) },
    { files: [], dirs: [] }
  );
const isDirectory = (elem) => isNaN(elem);

const directoriesWithSizes = (tree, currentPath = ["/"], directories = []) => {
  const { files, dirs } = getContents(R.path(currentPath, tree));

  if (dirs.length === 0) {
    return directories.concat({
      dirName: currentPath.join("/"),
      size: R.sum(files),
    });
  } else {
    const childrenDirs = dirs.flatMap((dir) =>
      directoriesWithSizes(tree, currentPath.concat(dir), directories)
    );
    return [
      {
        dirName: currentPath.join("/"),
        size:
          R.sum(files) +
          R.sum(
            childrenDirs
              .filter((dir) =>
                dirs
                  .map((dir) => `${currentPath.join("/")}/${dir}`)
                  .includes(dir.dirName)
              )
              .map((f) => f.size)
          ),
      },
    ].concat(childrenDirs);
  }
};

const part1 = (input) =>
  directoriesWithSizes(createTree(parseInput(input)))
    .filter((dir) => dir.size <= 100000)
    .reduce((sum, curr) => (sum = sum + curr.size), 0);

const part2 = (input) => {
  const directories = directoriesWithSizes(createTree(parseInput(input)));
  const mustBeFreed =
    30000000 - (70000000 - directories.find((d) => d.dirName === "/").size);

  return directories
    .sort((a, b) => a.size - b.size)
    .find(({ size }) => size > mustBeFreed).size;
};

const testInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

assert(part1(testInput) === 95437);
assert(part2(testInput) === 24933642);

const input = fs.readFileSync("inputs/day7.txt", "utf-8");

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
