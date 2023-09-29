import fs from "fs/promises";
import { getRootDir } from "../../utils/dirname";

export class Files {
    public rootDir: string = getRootDir();

    public async createJsonFile(name: string, config: any) {
        const file_path = `${this.rootDir}/.configs/${name}.json`;
        await fs.writeFile(file_path, JSON.stringify(config));
        return file_path;
    }
}
