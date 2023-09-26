import os from "os";
import axios from "axios";
import shelljs from "shelljs";
import AdmZip from "adm-zip";
import minimist from "minimist";
const args = minimist(process.argv.slice(2));

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

async function installV2rayBinaries(download_url: string) {
    const v2ray_zip_buffer: Buffer = (
        await axios({
            url: download_url,
            responseType: "arraybuffer",
        })
    ).data;
    const zip = new AdmZip(v2ray_zip_buffer);
    zip.extractAllTo("./src/v2ray-core", true);
    shelljs.chmod("+x", "./src/v2ray-core/v2ray");
}

async function start() {
    const target = getTarget();
    const download_url = DOWNLOAD_LINKS[target.toLowerCase()];
    if (!download_url) {
        console.log("os and arch not supported:", target);
        process.exit(0);
    }
    console.log("installing v2ray binaries for:", target);
    await installV2rayBinaries(download_url);
    console.log("Finished");
}

start();
