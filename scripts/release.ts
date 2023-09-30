import fs from "fs";
import minimist from "minimist";
import path from "path";
import AdmZip from "adm-zip";
import { executeCmd } from "./lib";
const args = minimist(process.argv);
const default_config = {
    subscription_urls: [],
    servers: [],
};

if (!args.v) {
    console.log("-v must be specified for the version");
    process.exit(0);
}

const dir = `.build/release/v${args.v}`;

if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

fs.mkdirSync(dir, { recursive: true });

const directories = {
    "linux-x64": path.join(dir, `v2switcher-v${args.v}-linux-x64`),
    "windows-x64": path.join(dir, `v2switcher-v${args.v}-windows-x64`),
    "macos-x64": path.join(dir, `v2switcher-v${args.v}-macos-x64`),
} as const;


// Creating release target folders
for (const dir of Object.values(directories)) fs.mkdirSync(dir);

fs.copyFileSync(
    ".build/index-linux",
    path.join(directories["linux-x64"], "v2ray-swithcer")
);

fs.copyFileSync(
    ".build/index-macos",
    path.join(directories["macos-x64"], "v2ray-switcher")
);

fs.copyFileSync(
    ".build/index-win.exe",
    path.join(directories["windows-x64"], "v2ray-switcher.exe")
);


// Creating empty config.json files for each release target 
for (const dir of Object.values(directories)) {
    fs.writeFileSync(
        path.join(dir, "config.json"),
        JSON.stringify(default_config, null, 4)
    );
}


// Downloading v2ray binaries for all targets 
executeCmd(
    `npx ts-node scripts/install-v2ray.ts --target darwin-x64 --outdir ${directories["macos-x64"]}`
);
executeCmd(
    `npx ts-node scripts/install-v2ray.ts --target linux-x64 --outdir ${directories["linux-x64"]}`
);
executeCmd(
    `npx ts-node scripts/install-v2ray.ts --target windows_nt-x64 --outdir ${directories["windows-x64"]}`
);
