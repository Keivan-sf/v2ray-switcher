import { Files } from "./utils/Files";
import { Subscription } from "./utils/SubscriptionServerExtractor";
import { V2rayJsonConfig } from "./utils/SubscriptionServerExtractor/interfaces";
import { ServerTester } from "./utils/ServerTester/index";

async function start() {
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    const configs: V2rayJsonConfig[] = [];
    for (const link of sub_links) {
        configs.push(...(await new Subscription(link).getJsonConfigs()));
    }
    // console.dir(configs, { depth: 10 });
    const tester = new ServerTester(4080);
    await tester.run(configs[0]);
    console.log("started resolved");
    console.dir(configs[0], { depth: 10 });
}

start();
