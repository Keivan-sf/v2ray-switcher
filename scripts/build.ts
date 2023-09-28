import fs from "fs";
import { executeCmd } from "./lib";

fs.rmSync(".dist", { recursive: true, force: true });
fs.rmSync(".build", { recursive: true, force: true });

executeCmd("npx tsc")
executeCmd("npx ncc build .dist/index.js -o .build")
executeCmd("npx ncc build .dist/index.js -o .build")
executeCmd("npx pkg .build/index.js -t node18-linux-x64,node18-macos-x64,node18-win-x64 --out-path .build")

fs.rmSync(".dist", { recursive: true, force: true });
fs.rmSync(".build/index.js", { recursive: true, force: true });

console.log('Build finished successfully')
