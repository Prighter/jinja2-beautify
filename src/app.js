import fs from "fs";
import { beautifyJinja } from "./beautifyJinja.js";

export function beautifyJinjaFile(file = "") {
  const beautifiedFile = formatFile(file);
  fs.writeFileSync(file, beautifiedFile);
} 

export function formatFile(file = "") {
  const html = fs.readFileSync(file, "utf8");
  return beautifyJinja(html);
}
