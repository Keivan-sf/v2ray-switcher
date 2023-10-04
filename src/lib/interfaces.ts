export interface V2rayJsonConfig {
    dns: {
        fallbackStrategy?: string;
        hosts?: {
            [key in string]: string;
        };
        servers?: (
            | string
            | {
                  address?: string;
                  domains?: string[];
                  fallbackStrategy?: string;
                  queryStrategy?: string;
              }
        )[];
        tag?: string;
    };
    inbounds: {
        port?: number;
        listen?: string;
        protocol?: string;
        settings?: {
            auth?: string;
            udp?: boolean;
            userLevel?: number;
            accounts?: { user: string; pass: string }[];
        };
        sniffing?: {
            destOverride?: string[];
            enabled?: boolean;
            metadataOnly?: boolean;
            routeOnly?: boolean;
        };
        tag?: string;
    }[];
    log: {
        loglevel: string;
    };
    outbounds: {
        domainStrategy?: string;
        mux?: {
            concurrency?: number;
            enabled?: boolean;
        };
        protocol?: string;
        proxySettings?: { tag?: string; transportLayer?: boolean };
        settings?: {
            address?: string;
            network?: string;
            port?: number;
            userLevel?: number;
            vnext?: {
                address?: string;
                port?: number;
                users?: {
                    alterId?: number;
                    encryption?: string;
                    flow?: string;
                    id?: string;
                    level?: number;
                    security?: string;
                }[];
            }[];
            response?: {
                type: "http";
            };
            servers?: any[];
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
            ip?: string[];
            outboundTag?: string;
            inboundTag?: string[];
            port?: string;
            type?: string;
        }[];
    };
    policy?: {
        levels?: { [k in string]: Object };
        system?: {
            statsOutboundDownlink?: boolean;
            statsOutboundUplink?: boolean;
        };
    };
    stats?: {};
}

export type vmess_uri_config = {
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

export interface ConfigURI {
    uri: string;
    convertToJson(): V2rayJsonConfig;
}
