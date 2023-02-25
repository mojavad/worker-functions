import { glob } from "./promise-glob";
import ts from "typescript";
export const parseWorkers = async () => {
  const workerFiles = await glob();

  const program = ts.createProgram(workerFiles, {});
  const checker = program.getTypeChecker();
  const exports = workerFiles
    .map((filename) => {
      const sourceFile = program.getSourceFile(filename);
      if (!sourceFile) return [];
      const exportSymbol = checker.getSymbolAtLocation(
        sourceFile?.getChildAt(0)
      );
      // @ts-ignore
      const exps = checker.getExportsAndPropertiesOfModule(
        // @ts-ignore
        exportSymbol || sourceFile.symbol
      );
      return exps;
    })
    .flat()
    .map((obj) => obj.escapedName as string);

  // check if there are duplicate function names.
  const duplicateSet = new Set();
  exports.forEach((fn) => {
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

  return exports;
};
