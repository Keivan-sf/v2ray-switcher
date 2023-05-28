import { Files } from "../Files";
import { V2rayJsonConfig } from "../SubscriptionServerExtractor/interfaces";
import treeKill from "tree-kill";
import * as $ from "node:child_process";
import { SocksProxyAgent } from "socks-proxy-agent";
import axios from "axios";

export class ServerTester {
    private files: Files = new Files();
    public connection_status: "connected" | "disconnected" = "disconnected";
    constructor(public port: number) {}
    public run = (config: V2rayJsonConfig) =>
        new Promise<void>(async (resolve, reject) => {
            this.setPortToConfig(config);
            const config_path = await this.files.createJsonFile(
                `${this.port}`,
                config
            );
            const command = `${__dirname}/v2ray-core/v2ray run --config=${config_path}`;
            const cmd = $.spawn(command, { shell: true });
            cmd.stdout.on("data", async (data: Buffer) => {
                const out = data.toString();
                console.log(out);
                if (!out.includes("started")) return;
                try {
                    console.log("Server started");
                    resolve();
                    if (cmd.pid) treeKill(cmd.pid);
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
}
