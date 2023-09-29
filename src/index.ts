import { Switcher } from "./lib/Switcher";
import { ConfigExtractor } from "./lib/SubscriptionServerExtractor";
import { getRootDir, setRootDir } from "./utils/dirname";
import { parseConfig } from "./lib/ConfigParser";
import path from "path";
import fs from "fs";

const cwd = process.argv.some((arg) => arg.includes("ts-node"))
    ? __dirname
    : process.cwd();

const configs_dir = path.join(cwd, ".configs");
const config_file = path.join(cwd, "config.json");

function generateEssentialFileAndDirectories() {
    if (!fs.existsSync(configs_dir)) fs.mkdirSync(configs_dir);
    if (!fs.existsSync(config_file)) {
        console.log("config.json file was not found");
        process.exit(0);
    }
}

async function start() {
    setRootDir(path.resolve(cwd));
    generateEssentialFileAndDirectories();
    const config = await parseConfig(path.join(getRootDir(), "config.json"));
    const sub_links = config.subscription_urls;
    const extractor = new ConfigExtractor(sub_links,config.servers, 30 * 60 * 1000);
    await extractor.startExtracting();
    const switcher = new Switcher(extractor, config.auth);
    switcher.start();
    console.log("\nThe process is started, connect to port 4080\n");
}

start();
