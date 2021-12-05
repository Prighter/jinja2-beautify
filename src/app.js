import fs from "fs";
import { beautifyJinja } from "./beautifyJinja.js";

export function beautifyJinjaFile(file = "") {
  fs.readFile(file, "utf8", (readError, code) => {
    if (readError) throw readError;

    const result = beautifyJinja(code);

    fs.writeFile(file, result, (writeError) => {
      if (writeError) throw writeError;
    });
  });
}
