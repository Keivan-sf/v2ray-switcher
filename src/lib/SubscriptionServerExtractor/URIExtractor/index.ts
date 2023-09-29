import axios from "axios";
export class URIExtractor {
    async extractURIsFromSubLink(link: string): Promise<string[]> {
        const source_code = await this.getSourceCode(link);
        return source_code.split("\n");
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
