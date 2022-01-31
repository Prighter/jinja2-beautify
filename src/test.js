#!/usr/bin/env node

import fs from "fs";
import assert from "assert";
import Yargs from "yargs";
import { formatFile } from "./app.js";

const files = ["general"];

// eslint-disable-next-line no-var
var yargs = Yargs(process.argv.slice(2))
  .option("throw", {
    alias: "t",
    describe: "throws the error",
    type: "boolean",
  })
  .help()
  .parse();

const it = (desc, fn) => {
  try {
    fn();
    console.log("\x1b[32m%s\x1b[0m", `\u2714 ${desc}`);
  } catch (error) {
    console.log("\n\x1b[31m%s\x1b[0m", `\u2718 ${desc}`);
    if (yargs.throw) throw error.message;

    console.error(error.message);
  }
};

files.forEach((file) => {
  it(`Should check if src/assets/${file}.html formatted correctly`, () => {
    assert.strictEqual(
      formatFile(`src/assets/${file}.html`),
      fs.readFileSync(`src/assets/${file}.expected.html`, "utf8")
    );
  });
});
