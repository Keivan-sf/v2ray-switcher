import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";
import { Readable } from "stream";

const DOWNLOAD_LINKS: { [k in string]: string } = {
    "Linux-x64":
        "https://github.com/v2fly/v2ray-core/releases/download/v5.7.0/v2ray-linux-64.zip",
};

function generateEssentialDirectories() {
    const configs_dir = path.join(__dirname, "..", "src/lib/Files/.configs");
    const subscription_file = path.join(__dirname, "..", "subscriptions.txt");
    const servers_file = path.join(__dirname, "..", "servers.txt");
    if (!fs.existsSync(configs_dir)) fs.mkdirSync(configs_dir);
    if (!fs.existsSync(subscription_file))
        fs.writeFileSync(subscription_file, "");
    if (!fs.existsSync(servers_file)) fs.writeFileSync(servers_file, "");
}

async function downloadV2rayBinaries() {
    const download_url = DOWNLOAD_LINKS[os.type() + "-" + os.arch()];
    if (!download_url) {
        console.log("os and arch not supported: ", os.type() + "-" + os.arch());
        process.exit(0);
    }
    await new Promise(async (resolve) => {
        const readable_data = (
            await axios({
                url: download_url,
                responseType: "stream",
            })
        ).data as Readable;
        readable_data.pipe(fs.createWriteStream("./v2ray-binary.zip"));
        readable_data.once("end", () => {
            resolve(null);
        });
    });
}

async function start() {
    generateEssentialDirectories();
    await downloadV2rayBinaries();
    console.log("Build finished successfully");
}

start();
