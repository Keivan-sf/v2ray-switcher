import os from "os";
import fs from "fs";
import path from "path";
import axios from "axios";
import shelljs from "shelljs";
import AdmZip from "adm-zip";
import minimist from "minimist";
const args = minimist(process.argv.slice(2));

if (!fs.existsSync(".cache")) fs.mkdirSync(".cache");

const DOWNLOAD_LINKS: { [k in string]: string } = {
    "linux-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-linux-64.zip",
    "darwin-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-macos-64.zip",
    "windows_nt-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-windows-64.zip",
};

function getTarget() {
    const forced_target = args.target;
    const target = forced_target ?? os.type() + "-" + os.arch();
    return target;
}

async function installV2rayBinaries(download_url: string, outdir: string) {
    const file_name = download_url.split("/").at(-1);
    let v2ray_zip_buffer: Buffer;
    if (!fs.existsSync(`.cache/${file_name}`)) {
        console.log("Cache not found, downloading")
        v2ray_zip_buffer = (
            await axios({
                url: download_url,
                responseType: "arraybuffer",
            })
        ).data;
        fs.writeFileSync(`.cache/${file_name}`, v2ray_zip_buffer);
    } else {
        console.log("Using cached version")
        v2ray_zip_buffer = fs.readFileSync(`.cache/${file_name}`);
    }
    const zip = new AdmZip(v2ray_zip_buffer);
    zip.extractAllTo(path.join(outdir, "v2ray-core"), true);
    shelljs.chmod("+x", path.join(outdir, "v2ray-core/v2ray"));
}

async function start() {
    const target = getTarget();
    const download_url = DOWNLOAD_LINKS[target.toLowerCase()];
    if (!download_url) {
        console.log("os and arch not supported:", target);
        process.exit(0);
    }
    console.log("installing v2ray binaries for:", target);
    await installV2rayBinaries(download_url, args.outdir);
    console.log("Finished");
}

start();
