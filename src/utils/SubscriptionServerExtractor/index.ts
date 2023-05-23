import { URIExtractor } from "./URIExtractor";
import { ConfigURI, V2rayJsonConfig } from "./interfaces";
export class Subscription {
    private jsonConfigs: V2rayJsonConfig[] | undefined;
    private uriExtractor: URIExtractor = new URIExtractor();
    constructor(public subscription_url: string) {}
    async getJsonConfigs() {
        if (this.jsonConfigs) return this.jsonConfigs;
        const servers = await this.uriExtractor.extractServersFromSubLink(
            this.subscription_url
        );
        this.jsonConfigs = this.convertURIArrayToJsonArray(servers);
        return this.jsonConfigs;
    }
    private convertURIArrayToJsonArray(uris: ConfigURI[]) {
        return uris.reduce(
            (acc: V2rayJsonConfig[], server): V2rayJsonConfig[] => {
                try {
                    const json = server.convertToJson();
                    acc.push(json);
                } catch (err) {}
                return acc;
            },
            []
        );
    }
}
