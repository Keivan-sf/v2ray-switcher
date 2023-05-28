export interface V2rayJsonConfig {
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
    convertToJson(): V2rayJsonConfig;
}
