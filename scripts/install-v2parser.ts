import fs from "fs";
import path from "path";
import axios from "axios";
import shelljs from "shelljs";
import minimist from "minimist";
const args = minimist(process.argv.slice(2));

const links = {
    "linux-64":
        "https://github.com/Keivan-sf/v2-uri-parser/releases/download/v0.1.0/v2parser",
};

async function installV2parserBinary() {
    let parser_buffer: Buffer;
    if (!fs.existsSync(".cache/v2parser")) {
        console.log("downloadingg v2parser binary");
        const request = await axios.get(links["linux-64"], {
            onDownloadProgress(e) {
                console.log(
                    "downloading ",
                    Math.floor((e.progress ?? 0) * 10000) / 100,
                    " %"
                );
            },
            responseType: "arraybuffer",
        });
        parser_buffer = request.data;
        fs.writeFileSync(".cache/v2parser", request.data);
    } else {
        console.log("Using the cached version");
        parser_buffer = fs.readFileSync(".cache/v2parser");
    }
    if (!fs.existsSync(path.join(args.outdir, "v2-uri-parser")))
        fs.mkdirSync(path.join(args.outdir, "v2-uri-parser"));
    fs.writeFileSync(
        path.join(args.outdir, "v2-uri-parser/v2parser"),
        parser_buffer
    );
    shelljs.chmod("+x", path.join(args.outdir, "v2-uri-parser/v2parser"));
    console.log("V2-uri-parser successfully installed");
}

installV2parserBinary();
