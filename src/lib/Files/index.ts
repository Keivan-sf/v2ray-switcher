import fs from "fs/promises";

export class Files {
    public rootDir: string = __dirname;
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
        const file_path = `${__dirname}/.configs/${name}.json`;
        await fs.writeFile(file_path, JSON.stringify(config));
        return file_path;
    }
}
