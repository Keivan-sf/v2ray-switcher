import { Files } from "./lib/Files";
import { Switcher } from "./lib/Switcher";
import { ConfigExtractor } from "./lib/SubscriptionServerExtractor";
import { setRootDir } from "./utils/dirname";
import path from "path";
import fs from "fs";

const cwd = process.argv.some(arg => arg.includes("ts-node")) ? __dirname : process.cwd();

const configs_dir = path.join(cwd, ".configs");
const subscription_file = path.join(cwd, "subscriptions.txt");
const servers_file = path.join(cwd, "servers.txt");

function generateEssentialDirectories() {
    if (!fs.existsSync(configs_dir)) fs.mkdirSync(configs_dir);
    if (!fs.existsSync(subscription_file))
        fs.writeFileSync(subscription_file, "");
    if (!fs.existsSync(servers_file)) fs.writeFileSync(servers_file, "");
}

async function start() {
    setRootDir(path.resolve(cwd));
    generateEssentialDirectories();
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks(subscription_file);
    const extractor = new ConfigExtractor(sub_links, 30 * 60 * 1000);
    await extractor.startExtracting();
    const switcher = new Switcher(extractor);
    switcher.start();
    console.log("\nThe process is started, connect to port 4080\n");
}

start();
