import { Files } from "./utils/Files";
import { Subscription } from "./utils/SubscriptionServerExtractor";
import { V2rayJsonConfig } from "./utils/SubscriptionServerExtractor/interfaces";

async function start() {
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    const configs: V2rayJsonConfig[] = [];
    for (const link of sub_links) {
        configs.push(...(await new Subscription(link).getJsonConfigs()));
    }
    console.dir(configs, { depth: 10 });
}

start();
