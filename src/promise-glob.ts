import { default as libGlob } from "glob";
export async function glob(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    libGlob("**/*.workers.ts", {}, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}
