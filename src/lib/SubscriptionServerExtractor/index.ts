import { exitWithError, log, warn } from "../../utils/logger";
import { V2rayJsonConfig } from "../interfaces";
import { URIExtractor } from "./URIExtractor";
import { parseURIs } from "./URIParser";

export class ConfigExtractor {
    private configs: { json: V2rayJsonConfig; uri: string }[] = [];
    private uriExtractor: URIExtractor = new URIExtractor();
    private first_run: boolean = true;
    constructor(
        private sub_links: string[],
        private extra_uris: string[],
        private delay: number
    ) {}

    public async startExtracting() {
        log.normal("Updating subscriptions...");
        const promises = [];
        for (const link of this.sub_links) {
            promises.push(this.uriExtractor.extractURIsFromSubLink(link));
        }
        const raw_uris = (await Promise.all(promises)).reduce((acc, l) => {
            acc.push(...l);
            return acc;
        }, []);
        raw_uris.push(...this.extra_uris);
        const parsed_uris = parseURIs(raw_uris);
        const configs = parsed_uris.map((u) => ({
            json: u.convertToJson(),
            uri: u.uri,
        }));

        if (configs.length === 0) {
            const err_msg =
                "No supported servers were found in subscription results or servers!";
            if (this.first_run) exitWithError(err_msg);
            warn(err_msg + "\n Using previous configurations");
            return;
        }
        const length = this.configs.unshift(...configs);
        if (length >= 100) {
            this.configs = this.configs.slice(0, 100);
        }
        setTimeout(() => this.startExtracting, this.delay);
    }

    public get(): { json: V2rayJsonConfig; uri: string } {
        const server = this.configs.shift()!;
        this.configs.push(server);
        return server;
    }
}
