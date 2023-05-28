import { V2rayJsonConfig } from "../interfaces";
import { Subscription } from "./Subscription";

export class ConfigExtractor {
    private unused_configs: V2rayJsonConfig[] = [];
    constructor(private sub_links: string[]) {}
    public async init() {
        const promises = [];
        for (const link of this.sub_links) {
            promises.push(new Subscription(link).getJsonConfigs());
        }
        const subscriptions_configs = await Promise.all(promises);
        for (const sub_config of subscriptions_configs) {
            this.unused_configs.push(...sub_config);
        }
        if (this.unused_configs.length === 0)
            throw new Error("No servers found in subscription links!");
    }
    public get() {
        return this.unused_configs.shift() as V2rayJsonConfig;
    }
}
