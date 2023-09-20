import {
    ConfigURI,
    V2rayJsonConfig,
} from "../../../../interfaces";

const a: V2rayJsonConfig = {
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

// class VlessURI extends  {}


// vless://3579bddf-ec56-429e-9515-dd252379d988@abrarv.emadagha.online:30185?security=&type=ws&path=/#kingkia-nbr6aer4
