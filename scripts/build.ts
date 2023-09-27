import fs from "fs";
import * as child_process from "child_process";

fs.rmSync(".dist", { recursive: true, force: true });
fs.rmSync(".build", { recursive: true, force: true });

function executeCmd(cmd: string) {
    const cmd_splitted = cmd.split(" ");
    const command =cmd_splitted[0] 
    const args =cmd_splitted.splice(1) 
    const output = child_process.spawnSync(command, args).output.toString();
    console.log(output);
    if (output.toLowerCase().includes("error")) throw new Error("Process exited with error");
}

executeCmd("npx tsc")
executeCmd("npx ncc build .dist/index.js -o .build")
executeCmd("npx ncc build .dist/index.js -o .build")
executeCmd("npx pkg .build/index.js -t node18-linux-x64,node18-macos-x64,node18-win-x64 --out-path .build")

fs.rmSync(".dist", { recursive: true, force: true });
fs.rmSync(".build/index.js", { recursive: true, force: true });

console.log('Build finished successfully')
