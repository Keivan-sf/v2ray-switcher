import axios from "axios";

export class URIExtractor {
    async extractServersFromSubLink(link: string) {
        const source_code = await this.getSourceCode(link);
        const servers = source_code
            .split("\n")
            .filter((l) => l && l.startsWith("vmess"))
            .map((l) => l.replace("\r", ""));
        return servers;
    }
    private async getSourceCode(url: string) {
        const source_base64 = (await axios.get(url)).data;
        const source = Buffer.from(source_base64, "base64").toString();
        return source;
    }
}
