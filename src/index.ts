import { Files } from "./lib/Files";
import { Switcher } from "./lib/Switcher";
import { ConfigExtractor } from "./lib/SubscriptionServerExtractor";
import { setRootDir } from "./utils/dirname";
import path from "path";
setRootDir(path.resolve(__dirname, ".."));

async function start() {
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    const extractor = new ConfigExtractor(sub_links, 30 * 60 * 1000);
    await extractor.startExtracting();
    const switcher = new Switcher(extractor);
    switcher.start();
    console.log("\nThe process is started, connect to port 4080\n");
}

start();
