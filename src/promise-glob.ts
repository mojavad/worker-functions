import { default as libGlob } from 'glob';
export async function glob(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    libGlob('**/*.worker.ts', {}, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}
