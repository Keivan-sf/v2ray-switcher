import { Files } from "../Files";
import { V2rayJsonConfig } from "../SubscriptionServerExtractor/interfaces";
import treeKill from "tree-kill";
import * as $ from "node:child_process";
import { SocksProxyAgent } from "socks-proxy-agent";
import axios from "axios";

export class ServerTester {
    private files: Files = new Files();
    constructor(public port: number) {}
    public async run(config: V2rayJsonConfig) {
        this.setPortToConfig(config);
        const cmd = await this.createV2rayProcess(config);
        await this.waitForV2rayToStart(cmd);
        await this.test(cmd.pid);
    }

    private async createV2rayProcess(config: V2rayJsonConfig) {
        const config_path = await this.files.createJsonFile(
            `${this.port}`,
            config
        );
        const command = `${__dirname}/v2ray-core/v2ray run --config=${config_path}`;
        return $.spawn(command, { shell: true });
    }

    private waitForV2rayToStart = (cmd: $.ChildProcessWithoutNullStreams) =>
        new Promise<void>((resolve) => {
            cmd.stdout.on("data", async (data: Buffer) => {
                const out = data.toString();
                console.log(out);
                if (!out.includes("started")) return;
                try {
                    console.log("Server started");
                    resolve();
                    // if (cmd.pid) treeKill(cmd.pid);
                } catch (err) {
                    console.log(err);
                }
            });
        });

    private setPortToConfig(config: V2rayJsonConfig) {
        config.inbounds = [
            {
                port: this.port,
                protocol: "SOCKS",
                settings: {
                    auth: "noauth",
                    udp: true,
                    userLevel: 8,
                },
                sniffing: {
                    destOverride: ["http", "tls"],
                    enabled: true,
                },
                tag: "socks",
            },
        ];
    }

    private async test(pid?: number) {
        try {
            const PROXY = `socks5://localhost:${this.port}`;
            const httpsAgent = new SocksProxyAgent(PROXY);
            const client = axios.create({
                httpsAgent,
                baseURL: "https://api.ipify.org",
                timeout: 15000,
            });
            const data = (await client.get("/")).data;
            console.log(`test data:`, data);
        } catch (err) {
            console.log("acios error actually here::: >>>", err);
            if (pid) treeKill(pid);
        }
    }
}
