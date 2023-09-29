import { VmessURI } from "./URITypes/Vmess";
import { VlessURI } from "./URITypes/Vless";
import { ConfigURI } from "../../interfaces";

export const parseURIs = (URIs: string[]): ConfigURI[] => {
    const servers = URIs.reduce((acc, l) => {
        if (!l) return acc;
        if (l.startsWith("vmess://")) acc.push(new VmessURI(l));
        if (l.startsWith("vless://")) acc.push(new VlessURI(l));
        return acc;
    }, [] as ConfigURI[]);
    return servers;
};

