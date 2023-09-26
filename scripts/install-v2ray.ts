import os from "os";
import axios from "axios";
import shelljs from "shelljs";
import AdmZip from "adm-zip";

const DOWNLOAD_LINKS: { [k in string]: string } = {
    "Linux-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-linux-64.zip",
    "Darwin-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-macos-64.zip",
    "Windows_NT-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-windows-64.zip",
};

async function installV2rayBinaries() {
    const download_url = DOWNLOAD_LINKS[os.type() + "-" + os.arch()];
    if (!download_url) {
        console.log("os and arch not supported: ", os.type() + "-" + os.arch());
        process.exit(0);
    }
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
    console.log("Installing v2ray binaries...");
    await installV2rayBinaries();
    console.log("Finished");
}

start();
