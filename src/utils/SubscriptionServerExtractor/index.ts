import { V2rayJsonConfig } from "../interfaces";
import { Subscription } from "./Subscription";

export class ConfigExtractor {
    private configs: V2rayJsonConfig[] = [];
    private first_run: boolean = true;
    constructor(private sub_links: string[], private delay: number) {}
    public async startExtracting() {
        const promises = [];
        for (const link of this.sub_links) {
            promises.push(new Subscription(link).getJsonConfigs());
        }
        const subscriptions_configs = await Promise.all(promises);
        const configs = [];
        for (const sub_config of subscriptions_configs) {
            configs.push(...sub_config);
        }
        if (configs.length === 0) {
            if (this.first_run)
                throw new Error("No servers found in subscription links!");
            console.log("No servers found in subscription links!");
            return;
        }
        this.configs.push(...configs);
        setTimeout(() => this.startExtracting, this.delay);
    }
    public get() {
        const server = this.configs.shift() as V2rayJsonConfig;
        this.configs.push(server);
        return server;
    }
}
