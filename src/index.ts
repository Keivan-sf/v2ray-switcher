import axios from "axios";
import { Files } from "./utils/Files";
import { ServerExtractor } from "./utils/SubscriptionServerExtractor";

async function start() {
    const files = new Files();
    const extractor = new ServerExtractor();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    for (const link of sub_links) {
        const servers = await extractor.extractServersFromSubLink(link);
        console.log(servers);
    }
}

start();
