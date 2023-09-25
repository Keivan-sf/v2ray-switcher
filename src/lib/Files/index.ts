import fs from "fs/promises";
import { getRootDir } from "../../utils/dirname";

export class Files {
    public rootDir: string = getRootDir();
    public async getSubscriptionLinks(path: string) {
        const subs_file = await fs.readFile(path);
        const sub_links = subs_file
            .toString()
            .split("\n")
            .filter((l) => l);
        if (sub_links.length < 1) {
            throw new Error("No sub links");
        }
        return sub_links;
    }
    public async createJsonFile(name: string, config: any) {
        const file_path = `${this.rootDir}/.configs/${name}.json`;
        await fs.writeFile(file_path, JSON.stringify(config));
        return file_path;
    }
}
