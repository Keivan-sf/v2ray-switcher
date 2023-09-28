import child_process from "child_process"

export function executeCmd(cmd: string) {
    const cmd_splitted = cmd.split(" ");
    const command =cmd_splitted[0] 
    const args =cmd_splitted.splice(1) 
    const output = child_process.spawnSync(command, args).output.toString();
    console.log(output);
    if (output.toLowerCase().includes("error")) throw new Error("Process exited with error");
}
