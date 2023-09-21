import axios from "axios";
import { VmessURI } from "./URITypes/Vmess";
import { ConfigURI } from "../../../interfaces";

export class URIExtractor {
    async extractServersFromSubLink(link: string): Promise<ConfigURI[]> {
        const source_code = await this.getSourceCode(link);
        const servers = source_code
            .split("\n")
            .filter((l) => l && l.startsWith("vmess"))
            .map((l) => l.replace("\r", ""));
        return servers.map((s) => new VmessURI(s));
    }
    private async getSourceCode(url: string) {
        const source_base64 = (await axios.get(url)).data;
        const source = Buffer.from(source_base64, "base64").toString();
        return source;
    }
}
