import * as z from "zod";
import fs from "fs/promises";
const configSchema = z.object({
    subscription_urls: z.array(z.string()).default([]),
    servers: z.array(z.string()).default([]),
    auth: z
        .object({
            username: z.string(),
            password: z.string(),
        })
        .optional(),
});
type ConfigSchema = z.infer<typeof configSchema>;

export const parseConfig = async (file_path: string): Promise<ConfigSchema> => {
    const file_content = await fs.readFile(file_path);
    const json = JSON.parse(file_content.toString());
    const parsed = configSchema.parse(json);
    if (parsed.servers.length === 0 && parsed.subscription_urls.length === 0) {
        console.log(
            "There are no servers nor subscription URIs in `config.json`"
        );
        process.exit(0);
    }
    return parsed;
};
