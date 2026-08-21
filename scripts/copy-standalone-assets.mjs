import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const projectRoot = process.cwd();
const assetCopies = [
  {
    source: resolve(projectRoot, ".next/static"),
    destination: resolve(projectRoot, ".next/standalone/.next/static"),
    required: true,
  },
  {
    source: resolve(projectRoot, "public"),
    destination: resolve(projectRoot, ".next/standalone/public"),
    required: false,
  },
];

for (const { source, destination, required } of assetCopies) {
  if (!existsSync(source)) {
    if (required) {
      throw new Error(`Required standalone asset directory is missing: ${source}`);
    }

    continue;
  }

  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { force: true, recursive: true });
  console.log(`Copied ${source} to ${destination}`);
}
