import { V2rayJsonConfig } from "../SubscriptionServerExtractor/interfaces";
import { ServerTester } from "./ServerTester";

export class Switcher {
    constructor(public configs: V2rayJsonConfig[]) {}
    updateConfigs(configs: V2rayJsonConfig[]) {

    }
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
        await tester.run(this.configs[0]);
    }
}
