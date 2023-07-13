import { vmess_uri_config, ConfigURI, V2rayJsonConfig } from "../../../../interfaces";

const example: V2rayJsonConfig = {
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

export class VmessURI implements ConfigURI {
    constructor(public uri: string) {}
    convertToJson(): V2rayJsonConfig {
        const uri_info = this.extractUriData();
        const config: V2rayJsonConfig = {
            ...example,
            outbounds: [
                {
                    ...example.outbounds[0],
                    settings: {
                        vnext: [
                            {
                                address: uri_info.add,
                                port: +uri_info.port,
                                users: [
                                    {
                                        id: uri_info.id,
                                        alterId: +uri_info.aid,
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
                        network: uri_info.net,
                        security: "",
                        wsSettings: {
                            headers: {
                                Host: uri_info.host,
                            },
                            path: uri_info.path,
                        },
                    },
                },
                example.outbounds[1],
                example.outbounds[2],
            ],
        };
        return config;
    }
    private extractUriData(): vmess_uri_config {
        const base_64 = this.uri.split("vmess://")[1];
        const url_info = JSON.parse(
            Buffer.from(base_64, "base64").toString()
        ) as vmess_uri_config;
        return url_info;
    }
}
