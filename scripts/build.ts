import fs from "fs";
import path from "path";
const configs_dir = path.join(__dirname, "..", "src/lib/Files/.configs");
const subscription_file = path.join(__dirname, "..", "subscriptions.txt");
const servers_file = path.join(__dirname, "..", "servers.txt");
if (!fs.existsSync(configs_dir)) fs.mkdirSync(configs_dir);
if (!fs.existsSync(subscription_file)) fs.writeFileSync(subscription_file, "");
if (!fs.existsSync(servers_file)) fs.writeFileSync(servers_file, "");

console.log("Build finished successfully");
