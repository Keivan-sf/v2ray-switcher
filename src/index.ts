import { Files } from "./utils/Files";
import { Subscription } from "./utils/SubscriptionServerExtractor/Subscription";
import { V2rayJsonConfig } from "./utils/interfaces";
import { Switcher } from "./utils/Switcher";
import { ConfigExtractor } from "./utils/SubscriptionServerExtractor";

async function start() {
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    const extractor = new ConfigExtractor(sub_links);
    await extractor.init();
    const switcher = new Switcher(extractor);
    switcher.start();
    // console.dir(configs, { depth: 10 });
}

start();
