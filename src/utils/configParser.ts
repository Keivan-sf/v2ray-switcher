import * as z from "zod";
import fs from "fs";
import { ZodError } from "zod";
import { exitWithError } from "../utils/logger";
const configSchema = z.object({
    subscription_urls: z.array(z.string()).default([]),
    servers: z.array(z.string()).default([]),
    logLevel: z.number().min(1).max(2).default(1),
    auth: z
        .object({
            username: z.string(),
            password: z.string(),
        })
        .optional(),
});

type ConfigSchema = z.infer<typeof configSchema>;

let configurations: ConfigSchema | null = null;

export const getConfig = (): ConfigSchema => {
    if (!configurations) throw new Error("No configurations has been set");
    return configurations;
};

export const setConfig = (config: ConfigSchema) => {
    configurations = config;
};

export const parseConfig = (file_path: string): ConfigSchema => {
    const file_content = fs.readFileSync(file_path);
    const json = JSON.parse(file_content.toString());
    try {
        const parsed = configSchema.parse(json);
        if (
            parsed.servers.length === 0 &&
            parsed.subscription_urls.length === 0
        ) {
            exitWithError(
                "There are no servers nor subscription URIs in `config.json`"
            );
        }
        return parsed;
    } catch (err: any) {
        if (err.issues) {
            const error = err as ZodError;
            const message = error.errors
                .map((e) => e.path.join(" > ") + ": " + e.message)
                .join("\n");
            exitWithError(
                "There are erros in your configuration file:\n" + message
            );
            return {} as any;
        } else {
            throw err;
        }
    }
};
