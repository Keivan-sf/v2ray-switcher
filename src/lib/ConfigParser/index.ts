import * as z from "zod";
import fs from "fs/promises";
const configSchema = z.object({
    subscription_urls: z.array(z.string()),
});
type ConfigSchema = z.infer<typeof configSchema>;

export const parseConfig = async (file_path: string): Promise<ConfigSchema> => {
    const file_content = await fs.readFile(file_path);
    const json = JSON.parse(file_content.toString());
    const parsed = configSchema.parse(json)
    return parsed; 
};
