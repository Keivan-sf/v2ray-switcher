import axios from "axios";
import { VmessURI } from "./URITypes/Vmess";
import { VlessURI } from "./URITypes/Vless";
import { ConfigURI } from "../../../interfaces";

export class URIExtractor {
    async extractServersFromSubLink(link: string): Promise<ConfigURI[]> {
        const source_code = await this.getSourceCode(link);
        const servers = source_code
            .split("\n")
            .reduce((acc , l) => {
                if(!l) return acc;
                if(l.startsWith("vmess://")) acc.push(new VmessURI(l))
                if(l.startsWith("vless://")) acc.push(new VlessURI(l))
                return acc;
            }, [] as ConfigURI[])
        return servers;
    }
    private async getSourceCode(url: string) {
        const raw_source_code = (await axios.get(url)).data;
        // checking to see if the source code is base-64 or not
        if (!raw_source_code.includes("://")) {
            return Buffer.from(raw_source_code, "base64").toString();
        } else {
            return Buffer.from(raw_source_code).toString();
        }
    }
}
