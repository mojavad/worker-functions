import { glob } from './promise-glob';
import crypto from 'crypto';
import { readFile } from 'fs/promises';

export async function generateTypes(): Promise<[string, string, string[][]]> {
  const workers = (await glob()).map((w) => [
    w,
    crypto.randomBytes(20).toString('hex')
  ]);
  const imports = workers
    .map(
      ([path, id]) =>
        `import * as Worker${id} from "../../../${path.split('.ts')[0]}"`
    )
    .join(';\n');

  return [
    `${imports}
type WorkerType = ${
      workers.length
        ? workers.map(([path, id]) => `typeof Worker${id}`).join(' & ')
        : `never`
    };

${await readFile(`./node_modules/worker-functions/templates/types.ts`)}
`,
    imports,
    workers
  ];
}
