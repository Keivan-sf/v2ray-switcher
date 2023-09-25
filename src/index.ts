import { Files } from "./lib/Files";
import { Switcher } from "./lib/Switcher";
import { ConfigExtractor } from "./lib/SubscriptionServerExtractor";
import { setRootDir } from "./utils/dirname";
import path from "path";
import fs from "fs";

function generateEssentialDirectories() {
    const configs_dir = path.join(__dirname, "..", ".configs");
    const subscription_file = path.join(__dirname, "..", "subscriptions.txt");
    const servers_file = path.join(__dirname, "..", "servers.txt");
    if (!fs.existsSync(configs_dir)) fs.mkdirSync(configs_dir);
    if (!fs.existsSync(subscription_file))
        fs.writeFileSync(subscription_file, "");
    if (!fs.existsSync(servers_file)) fs.writeFileSync(servers_file, "");
}

async function start() {
    setRootDir(path.resolve(__dirname, ".."));
    generateEssentialDirectories();
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    const extractor = new ConfigExtractor(sub_links, 30 * 60 * 1000);
    await extractor.startExtracting();
    const switcher = new Switcher(extractor);
    switcher.start();
    console.log("\nThe process is started, connect to port 4080\n");
}

start();
