import { glob } from "./promise-glob";
import { readFile } from "fs/promises";
import { init, parse } from "es-module-lexer";

(async () => {
  await init;

  const workerFiles = await glob();

  const functions = (
    await Promise.all(
      workerFiles.map(async (file) => {
        const source = await readFile(file, { encoding: "utf-8" });
        const [_, exports] = parse(source);

        return exports.map((exp) => exp.n);
      })
    )
  ).flat();

  // check if there are duplicate function names.
  const duplicateSet = new Set();
  functions.forEach((fn) => {
    if (duplicateSet.has(fn)) {
      console.error(
        "\x1b[31m",
        "Worker found with duplicate function name. All named function exports should have unique names."
      );
      console.error(
        "\x1b[31m",
        `Rename one instance of function named "${fn}."`
      );

      process.exit(1);
    } else {
      duplicateSet.add(fn);
    }
  });
})();
