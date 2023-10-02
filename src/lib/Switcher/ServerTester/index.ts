import { Files } from "../../Files";
import { V2rayJsonConfig } from "../../interfaces";
import treeKill from "tree-kill";
import * as $ from "node:child_process";
import { SocksProxyAgent } from "socks-proxy-agent";
import axios from "axios";
import { Switcher } from "..";
import { warn } from "../../../utils/errorHandler";

export class ServerTester {
    private files: Files = new Files();
    private status: "connected" | "disconnected" = "disconnected";
    constructor(
        public core_file_path: string, // /v2ray-core/v2ray
        public port: number,
        private switcher: Switcher
    ) {}
    public async run(config: V2rayJsonConfig) {
        this.setPortToConfig(config);
        const cmd = await this.createV2rayProcess(config);
        try {
            await this.waitForV2rayToStart(cmd);
        } catch (err) {
            this.handleStatusChange("disconnected");
            warn(err);
            return;
        }
        await this.startTesting(cmd.pid);
    }

    private async createV2rayProcess(config: V2rayJsonConfig) {
        const config_path = await this.files.createJsonFile(
            `${this.port}`,
            config
        );
        const command = `${this.core_file_path} run --config=${config_path}`;
        return $.spawn(command, { shell: true });
    }

    private waitForV2rayToStart = (cmd: $.ChildProcessWithoutNullStreams) =>
        new Promise<void>((resolve, reject) => {
            let is_fulfilled = false;

            setTimeout(() => {
                cmd.kill();
                if (is_fulfilled) reject("v2ray process timed out");
            }, 5000);

            cmd.stderr?.on("data", async (data: Buffer) => {
                const out = data.toString();
                if (out.includes("Failed to start") && !is_fulfilled)
                    reject(out);
            });

            cmd.stdout.on("data", async (data: Buffer) => {
                const out = data.toString();
                if (!out.includes("started")) return;
                try {
                    if (!is_fulfilled) resolve();
                } catch (err) {
                    warn(err);
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

    private async startTesting(pid?: number) {
        const result = await this.test(pid);
        if (result === "FAILED") {
            this.handleStatusChange("disconnected");
            return;
        }
        if (this.status === "disconnected") {
            this.handleStatusChange("connected");
        }
        setTimeout(() => this.startTesting(pid), 30 * 1000);
    }

    private async handleStatusChange(status: "connected" | "disconnected") {
        if (status === "disconnected") {
            this.status = "disconnected";
            this.switcher.fail(this);
        } else if (this.status === "disconnected") {
            this.status = "connected";
            this.switcher.success(this);
        }
    }

    private async test(pid?: number): Promise<"SUCCEED" | "FAILED"> {
        try {
            const PROXY = `socks5://localhost:${this.port}`;
            const httpsAgent = new SocksProxyAgent(PROXY);
            const client = axios.create({
                httpsAgent,
                baseURL: "https://dns.google.com/resolve?name=google.com",
                timeout: 10000,
            });
            await client.get("/");
            return "SUCCEED";
        } catch (err) {
            if (pid) treeKill(pid);
            return "FAILED";
        }
    }
}
