import { Files } from "./lib/Files";
import { Switcher } from "./lib/Switcher";
import { ConfigExtractor } from "./lib/SubscriptionServerExtractor";

async function start() {
    const files = new Files();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    const extractor = new ConfigExtractor(sub_links, 30 * 60 * 1000);
    await extractor.startExtracting();
    const switcher = new Switcher(extractor);
    switcher.start();
    console.log(
        "\nThe process is started, connect to `socks5://127.0.0.1:4080`\n"
    );
}

start();
