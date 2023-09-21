import { ConfigURI, V2rayJsonConfig } from "../../../../../interfaces";
import querystring from "query-string";

const sample_config: V2rayJsonConfig = {
    dns: {
        fallbackStrategy: "disabled_if_any_match",
        servers: [
            {
                address: "https://8.8.8.8/dns-query",
                domains: [],
                queryStrategy: "",
            },
            {
                address: "localhost",
                domains: ["full:..online"],
                fallbackStrategy: "disabled",
                queryStrategy: "",
            },
        ],
        tag: "dns",
    },
    inbounds: [
        {
            listen: "127.0.0.1",
            port: 2080,
            protocol: "socks",
            settings: { udp: true },
            sniffing: {
                destOverride: ["http", "tls", "quic"],
                enabled: true,
                metadataOnly: false,
                routeOnly: true,
            },
            tag: "socks-in",
        },
        {
            listen: "127.0.0.1",
            port: 2081,
            protocol: "http",
            sniffing: {
                destOverride: ["http", "tls", "quic"],
                enabled: true,
                metadataOnly: false,
                routeOnly: true,
            },
            tag: "http-in",
        },
    ],
    log: { loglevel: "warning" },
    outbounds: [
        {
            domainStrategy: "AsIs",
            protocol: "vless",
            settings: {
                vnext: [
                    {
                        address: "..online",
                        port: 30185,
                        users: [
                            {
                                encryption: "none",
                                id: "3579bddf---9515-dd252379d988",
                            },
                        ],
                    },
                ],
            },
            streamSettings: { network: "ws", wsSettings: { path: "/" } },
            tag: "proxy",
        },
        { domainStrategy: "", protocol: "freedom", tag: "direct" },
        { domainStrategy: "", protocol: "freedom", tag: "bypass" },
        { protocol: "blackhole", tag: "block" },
        {
            protocol: "dns",
            proxySettings: { tag: "proxy", transportLayer: true },
            settings: {
                address: "8.8.8.8",
                network: "tcp",
                port: 53,
                userLevel: 1,
            },
            tag: "dns-out",
        },
    ],
    policy: {
        levels: { "1": { connIdle: 30 } },
        system: { statsOutboundDownlink: true, statsOutboundUplink: true },
    },
    routing: {
        domainMatcher: "mph",
        domainStrategy: "AsIs",
        rules: [
            {
                inboundTag: ["socks-in", "http-in"],
                outboundTag: "dns-out",
                port: "53",
                type: "field",
            },
            { outboundTag: "proxy", port: "0-65535", type: "field" },
        ],
    },
    stats: {},
};

export class VlessURI implements ConfigURI {
    constructor(public uri: string) {}
    convertToJson(): V2rayJsonConfig {
        const info = this.exctractInfoFromURI();
        const config = {
            ...sample_config,
        };
        config.dns.servers = [
            {
                address: "https://8.8.8.8/dns-query",
                domains: [],
                queryStrategy: "",
            },
            {
                address: "localhost",
                domains: [`full:${info.host}`],
                fallbackStrategy: "disabled",
                queryStrategy: "",
            },
        ];
        config.outbounds![0] = {
            domainStrategy: "AsIs",
            protocol: "vless",
            settings: {
                vnext: [
                    {
                        address: info.host,
                        port: info.port,
                        users: [
                            {
                                encryption: "none",
                                id: info.secret,
                            },
                        ],
                    },
                ],
            },
            streamSettings: { network: info.type, wsSettings: { path: "/" } },
            tag: "proxy",
        };

        return config as V2rayJsonConfig;
    }
    exctractInfoFromURI(): {
        secret: string;
        host: string;
        port: number;
        type?: string;
        path?: string;
        security?: string;
    } {
        const without_protocol = this.uri.split("vless://")[1];
        const secret = without_protocol.split("@")[0];
        const host = without_protocol.split("@")[1].split(":")[0];
        const port = Number(without_protocol.split(":")[1].split("?")[0]);
        const queries = querystring.parse(without_protocol.split("?")[1]);
        const type = queries.type as string;
        const path = queries.path as string;
        const security = queries.security as string;
        return { type, path, security, secret, host, port };
    }
}
