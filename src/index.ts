import fs from "fs/promises";

async function start() {
    const subs_file = await fs.readFile("./subscriptions.txt");
    const sub_links = subs_file.toString().split("\n").filter(l => l);
    if(sub_links.length < 1) {
        throw new Error("No sub links");
    }
    console.log('links: ' , sub_links)
}

start();
