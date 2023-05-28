import { ConfigExtractor } from "../SubscriptionServerExtractor";
import { V2rayJsonConfig } from "../interfaces";
import { ServerTester } from "./ServerTester";

export class Switcher {
    constructor(public extractor: ConfigExtractor) {}
    async start() {
        const fail = (server: ServerTester) => {
            console.log(`the server failed:`, server.port);
        };

        const success = (server: ServerTester) => {
            console.log("the server succeeded", server.port);
        };
        const tester = new ServerTester(
            __dirname + "/v2ray-core/v2ray",
            4080,
            fail,
            success
        );
        await tester.run(this.extractor.get());
    }
}
