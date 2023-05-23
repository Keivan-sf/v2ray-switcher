import axios from "axios";
import { Files } from "./utils/Files";
import { URIExtractor } from "./utils/SubscriptionServerExtractor/URIExtractor";
type vmess_uri_config = {
    v: string;
    ps: string;
    add: string;
    port: string;
    id: string;
    aid: string;
    net: string;
    type: string;
    host: string;
    path: string;
    tls: string;
};

interface VmessConfig {
    dns: {
        hosts: {
            [key in string]: string;
        };
        servers: string[];
    };
    inbounds: {
        port: number;
        protocol: string;
        settings: {
            auth?: string;
            udp?: boolean;
            userLevel?: number;
        };
        sniffing?: {
            destOverride?: string[];
            enabled?: boolean;
        };
        tag: string;
    }[];
    log: {
        loglevel: string;
    };
    outbounds: {
        mux?: {
            concurrency?: number;
            enabled?: boolean;
        };
        protocol: string;
        settings: {
            vnext?: {
                address: string;
                port: number;
                users: {
                    alterId: number;
                    encryption: string;
                    flow: string;
                    id: string;
                    level: number;
                    security: string;
                }[];
            }[];
        };
        streamSettings?: {
            network?: string;
            security?: string;
            wsSettings?: {
                headers?: {
                    Host?: string;
                };
                path?: string;
            };
        };
        tag: string;
    }[];
    routing: {
        domainMatcher: string;
        domainStrategy: string;
        rules: {
            ip: string[];
            outboundTag: string;
            port: string;
            type: string;
        }[];
    };
}

let a = {
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
            protocol: "vmess",
            settings: {
                vnext: [
                    {
                        address: "mci.PRIVATE.com",
                        port: 80,
                        users: [
                            {
                                alterId: 0,
                                encryption: "",
                                flow: "",
                                id: "a-PRIVATE-ID-d",
                                level: 8,
                                security: "auto",
                            },
                        ],
                    },
                ],
            },
            streamSettings: {
                network: "ws",
                security: "",
                wsSettings: {
                    headers: {
                        Host: "input.PRIVATE.click",
                    },
                    path: "/http",
                },
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
async function start() {
    const files = new Files();
    const extractor = new URIExtractor();
    const sub_links = await files.getSubscriptionLinks("./subscriptions.txt");
    for (const link of sub_links) {
        const servers = await extractor.extractServersFromSubLink(link);
        for (const server of servers) {
            const base = server.split("vmess://")[1];
            const vmess_inf = JSON.parse(
                Buffer.from(base, "base64").toString()
            ) as vmess_uri_config;
            const config: VmessConfig = {
                ...a,
                outbounds: [
                    {
                        ...a.outbounds[0],
                        settings: {
                            vnext: [
                                {
                                    address: vmess_inf.add,
                                    port: +vmess_inf.port,
                                    users: [
                                        {
                                            id: vmess_inf.id,
                                            alterId: +vmess_inf.aid,
                                            encryption: "auto",
                                            flow: "",
                                            level: 8,
                                            security: "",
                                        },
                                    ],
                                },
                            ],
                        },
                        streamSettings: {
                            network: vmess_inf.net,
                            security: "",
                            wsSettings: {
                                headers: {
                                    Host: vmess_inf.host,
                                },
                                path: vmess_inf.path,
                            },
                        },
                    },
                    a.outbounds[1],
                    a.outbounds[2],
                ],
            };
            console.log(JSON.stringify(config));
            console.log("\n");
        }
    }
}

start();
