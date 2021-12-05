#!/usr/bin/env node

import Yargs from "yargs";
import { beautifyJinjaFile } from "./src/app.js";

const args = Yargs(process.argv.slice(2)).argv;

args._.forEach(beautifyJinjaFile);
