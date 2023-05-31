import { ConfigExtractor } from "../SubscriptionServerExtractor";
import { MainPort } from "./MainPort";
import { ServerTester } from "./ServerTester";

export class Switcher {
    private main_port = new MainPort(
        __dirname + "/v2ray-core/v2ray",
        4080,
        4081
    );
    private ready_testers: ServerTester[] = [];
    private connected_testers: ServerTester[] = [];
    constructor(public extractor: ConfigExtractor) {
        for (let i = 4075; i < 4080; i++) {
            this.ready_testers.push(
                new ServerTester(
                    __dirname + "/v2ray-core/v2ray",
                    i,
                    this
                )
            );
        }
    }
    async start() {
        for (let tester of this.ready_testers) {
            tester.run(this.extractor.get());
        }
    }
    public fail(tester: ServerTester) {
        console.log(`the server failed:`, tester.port);

        this.moveFromConnectedToReady(tester);
        tester.run(this.extractor.get());

        if (tester.port !== this.main_port.current_port) return;
        if (this.connected_testers.length < 1) {
            this.main_port.connected = false;
        } else {
            this.main_port.run(this.connected_testers[0].port);
        }
    }
    public success(tester: ServerTester) {
        console.log("the server succeeded", tester.port);

        this.moveFromReadyToConnected(tester);
        if (this.main_port.connected) return;
        this.main_port.run(tester.port);
    }

    private moveFromReadyToConnected(tester: ServerTester) {
        this.ready_testers = this.ready_testers.filter(
            (t) => tester.port !== t.port
        );
        if (this.connected_testers.some((t) => tester.port === t.port)) return;
        this.connected_testers.push(tester);
    }

    private moveFromConnectedToReady(tester: ServerTester) {
        this.connected_testers = this.connected_testers.filter(
            (t) => tester.port !== t.port
        );
        if (this.ready_testers.some((t) => tester.port === t.port)) return;
        this.ready_testers.push(tester);
    }
}
