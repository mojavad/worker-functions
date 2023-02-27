#!/usr/bin/env node
import { parseWorkers } from "./parse-workers";
import { generateTypes } from "./parse-types";
import { writeFile, mkdir, readFile } from "fs/promises";
async function main() {
  try {
    // Check for duplicate function names
    await parseWorkers();
  } catch {}
  const [types, imports, workers] = await generateTypes();
  await mkdir(`./node_modules/worker-functions/generated-client`, {
    recursive: true
  });
  await writeFile(
    `./node_modules/worker-functions/generated-client/index.ts`,
    await readFile(`./node_modules/worker-functions/templates/client.ts`)
  );
  await writeFile(
    `./node_modules/worker-functions/generated-client/type-gen.ts`,
    types
  );

  const functions = `
const functions = Object.fromEntries([
  ${workers.map(([path, id]) => `...Object.entries(Worker${id})`).join(",\n")}
]);
  `;
  await mkdir(`./node_modules/worker-functions/generated-worker`, {
    recursive: true
  });

  await writeFile(
    `./node_modules/worker-functions/generated-worker/index.ts`,
    imports +
      functions +
      (await readFile(`./node_modules/worker-functions/templates/worker.ts`))
  );

  try {
    await readFile("./wrangler.json");
  } catch {
    await writeFile(
      "./wrangler.json",
      JSON.stringify(
        {
          name: "my-worker",
          compatibility_date: "2023-02-26",
          main: "node_modules/worker-functions/generated-worker/index.ts",
          build: {
            command: "npx worker-functions"
          }
        },
        null,
        2
      )
    );
  }
}
main();
