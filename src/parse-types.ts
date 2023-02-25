import { glob } from "./promise-glob";
import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";

export async function generateTypes() {
  const workers = (await glob()).map((w) => [
    w,
    crypto.randomBytes(20).toString("hex"),
  ]);
  await mkdir(`./dist/workers-sdk`, { recursive: true });
  await writeFile(
    `./dist/workers-sdk/type-gen.ts`,
    `
${workers
  .map(
    ([path, id]) =>
      `import * as Worker${id} from "../../${path.split(".ts")[0]}"`
  )
  .join(";\n")}

type WorkerType = ${workers
      .map(([path, id]) => `typeof Worker${id}`)
      .join(" & ")};

type WorkerTypeFns = {
  [Fn in keyof WorkerType]: (
    ...p: Parameters<WorkerType[Fn]>
  ) => Promise<Awaited<ReturnType<WorkerType[Fn]>>>;
};
export type { WorkerTypeFns };`
  );
}
