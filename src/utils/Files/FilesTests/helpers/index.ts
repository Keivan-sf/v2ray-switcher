import { Files } from "../..";
import fs from "fs/promises";
import * as Crypto from "crypto";

export class FilesTestHelper {
    public filesInstance = new Files();
    public random_config_name: string;
    constructor() {
        this.filesInstance = new Files();
        this.random_config_name = Crypto.randomUUID();
    }
    async readConfigFile() {
        return (
            await fs.readFile(
                this.filesInstance.rootDir +
                    `/.configs/${this.random_config_name}.json`
            )
        ).toString();
    }
    async cleanConfigFile() {
        await fs.unlink(
            this.filesInstance.rootDir +
                `/.configs/${this.random_config_name}.json`
        );
    }
}
