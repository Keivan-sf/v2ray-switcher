import { Files } from "./utils/Files";
import { Subscription } from "./utils/SubscriptionServerExtractor";

async function start() {
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    for (const link of sub_links) {
        console.dir(await new Subscription(link).getJsonConfigs(), {
            depth: 10,
        });
    }
}

start();
