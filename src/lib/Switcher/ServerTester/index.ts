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
    private process: $.ChildProcess | null = null;
    public current_config: { json: V2rayJsonConfig; uri: string } | undefined;
    constructor(
        public core_file_path: string,
        public port: number,
        private switcher: Switcher
    ) {}
    public async run(config: { json: V2rayJsonConfig; uri: string }) {
        this.current_config = config;
        this.setPortToConfig(config.json);
        this.process = await this.createV2rayProcess(config.json);
        try {
            await this.waitForV2rayToStart();
        } catch (err) {
            this.handleStatusChange("disconnected");
            warn(err);
            return;
        }
        await this.startTesting();
    }

    private async createV2rayProcess(config: V2rayJsonConfig) {
        const config_path = await this.files.createJsonFile(
            `${this.port}`,
            config
        );
        const raw_cmd = `${this.core_file_path} run --config=${config_path}`;
        const cmd_split = raw_cmd.split(" ");
        const cmd = cmd_split.shift() as string;
        return $.spawn(cmd, cmd_split);
    }

    private waitForV2rayToStart = () =>
        new Promise<void>((resolve, reject) => {
            if (!this.process) return reject("No process");
            let is_fulfilled = false;

            setTimeout(() => {
                this.process?.kill();
                if (is_fulfilled) reject("v2ray process timed out");
            }, 5000);

            this.process.stderr?.on("data", async (data: Buffer) => {
                const out = data.toString();
                if (out.includes("Failed to start") && !is_fulfilled)
                    reject(out);
            });

            this.process.stdout?.on("data", async (data: Buffer) => {
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

    private async startTesting() {
        const result = await this.test();
        if (result === "FAILED") {
            this.handleStatusChange("disconnected");
            return;
        }
        if (this.status === "disconnected") {
            this.handleStatusChange("connected");
        }
        setTimeout(() => this.startTesting(), 30 * 1000);
    }

    private async handleStatusChange(status: "connected" | "disconnected") {
        if (status === "disconnected") {
            this.status = "disconnected";
            try {
                this.process?.kill();
                if (this.process?.pid) treeKill(this.process.pid);
            } catch (err) {}
            this.switcher.fail(this);
        } else if (this.status === "disconnected") {
            this.status = "connected";
            this.switcher.success(this);
        }
    }

    private async test(): Promise<"SUCCEED" | "FAILED"> {
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
            return "FAILED";
        }
    }
}
