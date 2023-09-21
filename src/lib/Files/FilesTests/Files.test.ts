import { FilesTestHelper } from "./helpers";

describe("Files", () => {
    it("Should create a config file with json data", async () => {
        const helper = new FilesTestHelper();
        await helper.filesInstance.createJsonFile(
            `${helper.random_config_name}`,
            {
                foo: "bar",
            }
        );
        expect(await helper.readConfigFile()).toBe(
            JSON.stringify({ foo: "bar" })
        );
        helper.cleanConfigFile();
    });
    it("Should return the file path of the newly created file", async () => {
        const helper = new FilesTestHelper();
        const file_path = await helper.filesInstance.createJsonFile(
            `${helper.random_config_name}`,
            {
                foo: "bar",
            }
        );
        expect(file_path).toBe(
            `${helper.filesInstance.rootDir}/.configs/${helper.random_config_name}.json`
        );
        helper.cleanConfigFile();
    });
    it("Should rewrite a previously created file with the same name", async () => {
        const helper = new FilesTestHelper();
        await helper.filesInstance.createJsonFile(
            `${helper.random_config_name}`,
            {
                foo: "bar",
            }
        );
        await helper.filesInstance.createJsonFile(
            `${helper.random_config_name}`,
            {
                bar: "foo",
            }
        );
        expect(await helper.readConfigFile()).toBe(
            JSON.stringify({ bar: "foo" })
        );
        helper.cleanConfigFile();
    });
});
