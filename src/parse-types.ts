import { glob } from "./promise-glob";

async function main() {
  const workers = await glob();
  console.log(workers);
}
main();
