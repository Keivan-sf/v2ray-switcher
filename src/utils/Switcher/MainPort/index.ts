import treeKill from "tree-kill";
import { Files } from "../../Files";
import * as $ from "node:child_process";
const socks5_config = {
    dns: {
        hosts: {
            "domain:googleapis.cn": "googleapis.com",
        },
        servers: ["1.1.1.1"],
    },
    inbounds: [
        {
            port: 10808,
            protocol: "socks",
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
        {
            port: 10809,
            protocol: "http",
            settings: {
                userLevel: 8,
            },
            tag: "http",
        },
    ],
    log: {
        loglevel: "warning",
    },
    outbounds: [
        {
            mux: {
                concurrency: 8,
                enabled: false,
            },
            protocol: "socks",
            settings: {
                servers: [
                    {
                        address: "127.0.0.1",
                        level: 8,
                        method: "chacha20-poly1305",
                        ota: false,
                        password: "",
                        port: 1080,
                    },
                ],
            },
            streamSettings: {
                network: "tcp",
                security: "",
            },
            tag: "proxy",
        },
        {
            protocol: "freedom",
            settings: {},
            tag: "direct",
        },
        {
            protocol: "blackhole",
            settings: {
                response: {
                    type: "http",
                },
            },
            tag: "block",
        },
    ],
    routing: {
        domainMatcher: "mph",
        domainStrategy: "IPIfNonMatch",
        rules: [
            {
                ip: ["1.1.1.1"],
                outboundTag: "proxy",
                port: "53",
                type: "field",
            },
        ],
    },
};
export class MainPort {
    private files = new Files();
    private config = socks5_config;
    private current_pid?: number;
    public current_port?: number;
    public connected: boolean = false;
    constructor(
        private core_file_path: string,
        public socks5_port: number,
        public http_port: number
    ) {
        this.config.inbounds[0].port = socks5_port;
        this.config.inbounds[1].port = http_port;
    }
    public async run(port: number) {
        console.log("Main port starting to point to: " + port);
        this.current_port = port;
        if (this.current_pid) treeKill(this.current_pid);
        this.connected = true;
        this.setOutboundPort(port);
        const cmd = await this.createV2rayProcess(port);
        await this.waitForV2rayToStart(cmd);
    }

    private async createV2rayProcess(port: number) {
        const config_path = await this.files.createJsonFile(
            `${port}`,
            this.config
        );
        const command = `${this.core_file_path} run --config=${config_path}`;
        const cmd = $.spawn(command, { shell: true });
        this.current_pid = cmd.pid;
        return cmd;
    }

    private setOutboundPort(port: number) {
        this.config.outbounds[0].settings.servers![0].port = port;
    }

    private waitForV2rayToStart = (cmd: $.ChildProcessWithoutNullStreams) =>
        new Promise<void>((resolve) => {
            cmd.stdout.on("data", async (data: Buffer) => {
                const out = data.toString();
                if (!out.includes("started")) return;
                console.log("Main port started running on 4080");
                resolve();
            });
        });
}
