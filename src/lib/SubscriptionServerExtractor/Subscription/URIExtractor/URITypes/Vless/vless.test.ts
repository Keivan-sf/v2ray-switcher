import { VlessURI } from ".";
describe("vless", () => {
    it("should extract data from vless uri", () => {
        const server = new VlessURI(
            "vless://3579bddf-ec57-439e-9525-dd452379d988@abrarv.online:30185?security=&type=ws&path=/nbr6aer"
        );
        expect(server.exctractInfoFromURI()).toStrictEqual({
            type: "ws",
            path: "/nbr6aer",
            security: "",
            secret: "3579bddf-ec57-439e-9525-dd452379d988",
            host: "abrarv.online",
            port: 30185,
        });
    });
});
